-- ========================================
-- PROFILES TABLE & AUTO-CREATION (SAFE)
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create Profiles Table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Drop existing policies (to avoid conflicts)
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- 4. Recreate policies
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select 
  using ( true );

create policy "Users can insert their own profile." 
  on public.profiles for insert 
  with check ( auth.uid() = id );

create policy "Users can update own profile." 
  on public.profiles for update 
  using ( auth.uid() = id );

-- 5. Create/Replace the function FIRST
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- 6. DROP the trigger if it already exists (Supabase doesn't allow IF NOT EXISTS for triggers)
drop trigger if exists on_auth_user_created on auth.users;

-- 7. NOW create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Backfill for existing users (won't duplicate)
insert into public.profiles (id, full_name, avatar_url)
select id, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;
