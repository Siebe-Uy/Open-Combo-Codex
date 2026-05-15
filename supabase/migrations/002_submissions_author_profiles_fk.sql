-- PostgREST embeds (profiles:author_id) require a direct FK to profiles.
-- author_id values match profiles.id because both reference the same auth user.

alter table public.combo_submissions
  drop constraint if exists combo_submissions_author_id_fkey;

alter table public.combo_submissions
  add constraint combo_submissions_author_id_fkey
  foreign key (author_id) references public.profiles (id) on delete cascade;
