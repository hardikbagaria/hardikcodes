-- Allow Admins to Delete Comments
create policy "Admins can delete any comment" 
  on public.comments for delete 
  using ( auth.jwt() ->> 'email' = 'hardikbagaria0@gmail.com' ); -- REPLACE WITH YOUR EMAIL

-- Also, allow users to delete their own comments (optional, but good UX)
create policy "Users can delete own comments" 
  on public.comments for delete 
  using ( auth.uid() = user_id );
no