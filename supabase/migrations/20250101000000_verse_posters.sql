-- Create verse_posters table
create table if not exists verse_posters (
  id uuid default gen_random_uuid() primary key,
  verse_text text not null,
  reference text not null,
  style text not null,
  language text default 'pt',
  image_url text not null,
  prompt text,
  hash text unique, -- hash(verse_text + reference + style + language)
  created_at timestamptz default now()
);

-- Enable RLS
alter table verse_posters enable row level security;

-- Policy: Public read access
create policy "Verse Posters are public viewable"
  on verse_posters for select
  using ( true );

-- Policy: Service Role write access (Edge Function)
-- No public insert policy needed since client talks to Edge Function.

-- Create storage bucket if not exists
insert into storage.buckets (id, name, public)
values ('verse-posters', 'verse-posters', true)
on conflict (id) do nothing;

-- Storage Policy: Public read
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'verse-posters' );

-- Storage Policy: Service Role insert (Edge Function handles upload)
-- Implicitly allowed for service_role, but if needed for authenticated users via function context:
create policy "Service Role Upload"
  on storage.objects for insert
  with check ( bucket_id = 'verse-posters' );
