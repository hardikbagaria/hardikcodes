-- 1. Create table if it doesn't exist
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  post_id uuid references public.posts not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

-- 2. Enable RLS
alter table public.likes enable row level security;

-- 3. Drop existing policies to avoid conflicts
drop policy if exists "Likes are viewable by everyone" on public.likes;
drop policy if exists "Authenticated users can toggle likes" on public.likes;
drop policy if exists "Users can remove their own likes" on public.likes;

-- 4. Re-create policies
create policy "Likes are viewable by everyone" 
  on public.likes for select 
  using ( true );

create policy "Authenticated users can toggle likes" 
  on public.likes for insert 
  with check ( auth.uid() = user_id );

create policy "Users can remove their own likes" 
  on public.likes for delete 
  using ( auth.uid() = user_id );
