-- Create storage bucket for devotional covers
insert into storage.buckets (id, name, public)
values ('devotional-covers', 'devotional-covers', true)
on conflict (id) do nothing;

-- Storage Policy: Public read
create policy "Devotional Covers are public"
  on storage.objects for select
  using ( bucket_id = 'devotional-covers' );

-- Storage Policy: Service Role upload
create policy "Service Role Upload Devotional Covers"
  on storage.objects for insert
  with check ( bucket_id = 'devotional-covers' );
