-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- POSTS Table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  content text not null, -- Markdown content
  excerpt text,
  cover_image text,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies for Posts
create policy "Public posts are viewable by everyone" 
  on public.posts for select 
  using ( published = true );

create policy "Admins can view all posts" 
  on public.posts for select 
  using ( auth.jwt() ->> 'email' = 'hardikbagaria0@gmail.com' ); -- REPLACE WITH YOUR ACTUAL GOOGLE EMAIL

create policy "Admins can insert/update posts" 
  on public.posts for all 
  using ( auth.jwt() ->> 'email' = 'hardikbagaria0@gmail.com' ); -- REPLACE WITH YOUR EMAIL

-- COMMENTS Table
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id),
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone" 
  on public.comments for select 
  using ( true );

create policy "Authenticated users can comment" 
  on public.comments for insert 
  with check ( auth.role() = 'authenticated' );

-- LIKES Table
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id), -- Nullable for anonymous likes if desired, but better to track
  session_id text, -- For anonymous likes fingerprinting
  created_at timestamp with time zone default now(),
  unique(post_id, user_id),
  unique(post_id, session_id)
);

alter table public.likes enable row level security;

create policy "Everyone can view and create likes" 
  on public.likes for all 
  using ( true );
