-- 1. Create a new storage bucket called 'blog-images'
insert into storage.buckets (id, name, public) 
values ('blog-images', 'blog-images', true);

-- 2. Allow public access to view images
create policy "Give public access to blog-images" 
  on storage.objects for select 
  using ( bucket_id = 'blog-images' );

-- 3. Allow authenticated users (Admins) to upload images
create policy "Allow authenticated uploads" 
  on storage.objects for insert 
  with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

-- 4. Allow updating/deleting own images (optional)
create policy "Allow updates" 
  on storage.objects for update
  using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );
  
create policy "Allow deletes" 
  on storage.objects for delete
  using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );
