-- 20241106123500_add_user_id_to_categories.sql
-- migration to add user_id column to categories table if it doesn't already exist
-- purpose:
-- 1. add user_id column to categories table to associate categories with users
-- 2. add foreign key constraint for the column referencing users(id)
-- 3. ensure compliance with the database design in db-plan.md

alter table categories add column if not exists user_id uuid;

-- add foreign key constraint conditionally if it does not exist
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'categories_user_id_fkey'
  ) then
    alter table categories add constraint categories_user_id_fkey foreign key (user_id) references auth.users(id);
  end if;
end
$$; 

alter table categories enable row level security;

-- RLS Policies for categories
create policy "Users can read their own categories"
    on public.categories
    for select
    to authenticated
    using (auth.uid() = user_id);


create policy "Users can create their own categories"
    on public.categories
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own categories"
    on public.categories
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
    on public.categories
    for delete
    to authenticated
    using (auth.uid() = user_id);

