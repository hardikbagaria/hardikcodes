-- 1. Create Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text not null unique,
  description text,
  content text, -- Markdown (Readme)
  image_url text, -- Cover image
  tags text[], -- Array of strings e.g. ['Next.js', 'Supabase']
  demo_link text,
  github_link text,
  published boolean default true
);

-- 2. Enable RLS
alter table public.projects enable row level security;

-- 3. Policies
create policy "Public projects are viewable by everyone." 
  on public.projects for select 
  using ( true );

create policy "Admins can insert projects" 
  on public.projects for insert 
  with check ( auth.jwt() ->> 'email' = 'hardikbagaria0@gmail.com' );

create policy "Admins can update projects" 
  on public.projects for update
  using ( auth.jwt() ->> 'email' = 'hardikbagaria0@gmail.com' );

create policy "Admins can delete projects" 
  on public.projects for delete
  using ( auth.jwt() ->> 'email' = 'hardikbagaria0@gmail.com' );
