-- 1. Add Parent ID to Comments for Nesting
alter table public.comments 
add column if not exists parent_id uuid references public.comments(id) on delete cascade;

-- 2. Create Comment Likes Table
create table if not exists public.comment_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  comment_id uuid references public.comments(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, comment_id)
);

-- 3. Enable RLS
alter table public.comment_likes enable row level security;

-- 4. Policies for Comment Likes
drop policy if exists "Comment likes viewable by everyone" on public.comment_likes;
drop policy if exists "Authenticated users can toggle comment likes" on public.comment_likes;
drop policy if exists "Users can remove their own comment likes" on public.comment_likes;

create policy "Comment likes viewable by everyone" 
  on public.comment_likes for select using ( true );

create policy "Authenticated users can toggle comment likes" 
  on public.comment_likes for insert with check ( auth.uid() = user_id );

create policy "Users can remove their own comment likes" 
  on public.comment_likes for delete using ( auth.uid() = user_id );
