-- Create Partners Table
create table if not exists public.partners (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    logo_url text, -- optional
    link_url text not null,
    tagline text,
    tier text default 'standard', -- standard, gold, platinum
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Partner Leads Table
create table if not exists public.partner_leads (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    whatsapp text not null,
    message text,
    status text default 'new', -- new, contacted, closed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Partners
alter table public.partners enable row level security;
-- Public Read Access
create policy "Partners are viewable by everyone" on public.partners
    for select using (true);
-- Admin Write Access (simplified for MVP: authenticated users can't write, only service_role/admin)
-- For now, no public insert policy.

-- RLS: Partner Leads
alter table public.partner_leads enable row level security;
-- Public Insert Access (Anyone can submit lead)
create policy "Anyone can insert partner leads" on public.partner_leads
    for insert with check (true);
-- No public read access (Only admin)
