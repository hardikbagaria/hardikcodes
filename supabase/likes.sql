-- Create a table for likes
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  post_id uuid references public.posts not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id) -- Prevent duplicate likes from same user on same post
);

-- Enable RLS
alter table public.likes enable row level security;

-- Policies
create policy "Likes are viewable by everyone" 
  on public.likes for select 
  using ( true );

create policy "Authenticated users can toggle likes" 
  on public.likes for insert 
  with check ( auth.uid() = user_id );

create policy "Users can remove their own likes" 
  on public.likes for delete 
  using ( auth.uid() = user_id );

