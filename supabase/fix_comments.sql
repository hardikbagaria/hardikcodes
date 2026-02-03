-- 1. Drop the old foreign key to auth.users (if it exists)
-- We attempt to drop the constraint by name. Default is usually comments_user_id_fkey
alter table public.comments 
  drop constraint if exists comments_user_id_fkey;

-- 2. Add the new foreign key to public.profiles
alter table public.comments
  add constraint comments_user_id_fkey
  foreign key (user_id)
  references public.profiles(id)
  on delete cascade;

-- 3. Just in case, ensure the RLS allows insert properly
-- (This policy remains the same, but just confirming)
drop policy if exists "Authenticated users can comment" on public.comments;
create policy "Authenticated users can comment" 
  on public.comments for insert 
  with check ( auth.role() = 'authenticated' );
