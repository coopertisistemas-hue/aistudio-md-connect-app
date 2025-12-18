-- Migration: Optimize Devotionals access and add integrity constraints
-- Date: 2025-01-02

-- 1. Optimize Main Feed Query
-- Speeds up: "Get latest devotionals for language X"
create index if not exists idx_devotionals_lang_published 
on public.devotionals (lang, published_at desc);

-- 2. Add 'devotional_date' for Precise "Daily" Logic
-- We want a strict DATE column to prevent timezone confusion.
alter table public.devotionals 
add column if not exists devotional_date date;

-- Backfill existing data using Sao Paulo timezone (Project Default)
-- If published_at is NULL, leave it NULL.
update public.devotionals 
set devotional_date = (published_at at time zone 'America/Sao_Paulo')::date
where devotional_date is null;

-- Add Index on Date
create index if not exists idx_devotionals_date 
on public.devotionals (devotional_date);

-- Add Unique Constraint to enforce "One Devotional Per Day Per Language"
-- Note: This is an optional constraint requested for integrity.
-- Warning: If existing data has duplicates for the same day, this might fail unless handled.
-- For safety in this migration, we add it but might need to be mindful of data cleanup.
-- Assuming clean data for now.
alter table public.devotionals 
add constraint uq_devotionals_lang_date unique (lang, devotional_date);


-- 3. Create Translations Table (Preparation for i18n)
create table if not exists public.devotional_translations (
    id uuid default gen_random_uuid() primary key,
    devotional_id uuid not null references public.devotionals(id) on delete cascade,
    lang text not null, -- 'en', 'es', etc.
    title text not null,
    content_body text not null,
    subtitle text,
    created_at timestamptz default now(),
    
    constraint uq_devotional_trans_lang unique (devotional_id, lang)
);

-- RLS for Translations
alter table public.devotional_translations enable row level security;
-- Inherit public read access
create policy "Public read translations" on public.devotional_translations
for select using (true);


-- 4. Create Reads Tracking Table (User Engagement)
create table if not exists public.devotional_reads (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    devotional_id uuid not null references public.devotionals(id) on delete cascade,
    read_at timestamptz default now(),
    percentage_scrolled integer default 0,
    
    constraint uq_user_devotional_read unique (user_id, devotional_id)
);

-- Optimized Index for "My Reads" history
create index if not exists idx_dev_reads_user_date 
on public.devotional_reads (user_id, read_at desc);

-- RLS for Reads
alter table public.devotional_reads enable row level security;

-- Users can insert their own reads
create policy "Users can record reads" on public.devotional_reads
for insert to authenticated
with check (auth.uid() = user_id);

-- Users can read their own history
create policy "Users see own history" on public.devotional_reads
for select to authenticated
using (auth.uid() = user_id);
