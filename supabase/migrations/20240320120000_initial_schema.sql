-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for DailyPost including categories, posts, and error_logs tables
-- with appropriate RLS policies and constraints.

-- Note: The auth.users table is managed by Supabase Auth, so we don't create it here

-- Create categories table
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text not null check (char_length(description) <= 250)
);

-- Enable RLS for categories
alter table public.categories enable row level security;

-- RLS Policies for categories (public read-only access)
create policy "Allow public read access to categories"
    on public.categories
    for select
    to anon, authenticated
    using (true);

create policy "Allow authenticated users to create categories"
    on public.categories
    for insert
    to authenticated
    with check (true);

-- Create posts table
create table public.posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    prompt text not null check (char_length(prompt) <= 500),
    size text not null,
    content text not null check (char_length(content) <= 1000),
    category_id uuid not null references public.categories(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS for posts
alter table public.posts enable row level security;

-- Create indexes for posts
create index posts_user_id_idx on public.posts(user_id);
create index posts_category_id_idx on public.posts(category_id);

-- RLS Policies for posts
create policy "Users can read their own posts"
    on public.posts
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their own posts"
    on public.posts
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own posts"
    on public.posts
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
    on public.posts
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create error_logs table
create table public.error_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    error_message text not null,
    error_context text,
    created_at timestamptz not null default now()
);

-- Enable RLS for error_logs
alter table public.error_logs enable row level security;

-- RLS Policies for error_logs (system access only, no user access)
-- Note: This effectively blocks all regular user access as there's no policy granting access

-- Create function and trigger for updating updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_updated_at
    before update on public.posts
    for each row
    execute function public.handle_updated_at(); 