create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (char_length(username) between 2 and 40),
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.combo_votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  combo_id text not null,
  combo_source text not null check (combo_source in ('markdown', 'submission')),
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, combo_id, combo_source)
);

create table if not exists public.combo_submissions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'pending', 'changes_requested', 'approved', 'rejected')),
  review_notes text,
  combo jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  reviewed_at timestamptz
);

create or replace view public.combo_vote_totals as
select
  combo_id,
  combo_source,
  count(*) filter (where vote = 1)::int as upvotes,
  count(*) filter (where vote = -1)::int as downvotes,
  coalesce(sum(vote), 0)::int as score
from public.combo_votes
group by combo_id, combo_source;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('moderator', 'admin')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'user_name', ''),
      nullif(new.raw_user_meta_data ->> 'preferred_username', ''),
      split_part(new.email, '@', 1),
      'duelist-' || substr(new.id::text, 1, 8)
    ),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.combo_votes enable row level security;
alter table public.combo_submissions enable row level security;

create policy "Profiles are readable by everyone"
on public.profiles for select
using (true);

create policy "Users update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Votes are readable by everyone"
on public.combo_votes for select
using (true);

create policy "Users manage their own votes"
on public.combo_votes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Approved submissions are readable by everyone"
on public.combo_submissions for select
using (status = 'approved' or auth.uid() = author_id or public.is_moderator());

create policy "Users create their own submissions"
on public.combo_submissions for insert
with check (auth.uid() = author_id);

create policy "Users update own non-approved submissions"
on public.combo_submissions for update
using (auth.uid() = author_id and status in ('draft', 'changes_requested'))
with check (auth.uid() = author_id and status in ('draft', 'pending'));

create policy "Moderators review submissions"
on public.combo_submissions for update
using (public.is_moderator())
with check (public.is_moderator());
