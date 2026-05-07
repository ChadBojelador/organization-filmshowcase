-- Supabase/Postgres schema for FESTORAMA films
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public."Films" (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  thumbnail_url text not null,
  release_date date not null,
  views integer not null default 0,
  file_id text not null,
  video_embed_url text not null,
  video_source_url text not null,
  video_source_type text not null default 'embed',
  video_provider text not null default 'google-drive',
  created_by uuid,
  created_at timestamptz not null default now(),

  constraint films_views_non_negative check (views >= 0),
  constraint films_source_type_allowed check (video_source_type in ('embed', 'mp4')),
  constraint films_provider_allowed check (video_provider in ('google-drive', 'external')),
  constraint films_file_id_not_empty check (length(trim(file_id)) > 0)
);

create index if not exists films_created_at_idx
  on public."Films" (created_at desc);

create index if not exists films_release_date_idx
  on public."Films" (release_date desc);

create index if not exists films_views_idx
  on public."Films" (views desc);

create unique index if not exists films_file_id_unique_idx
  on public."Films" (file_id);

-- Optional RLS setup. Keep enabled for production.
alter table public."Films" enable row level security;

-- Public read policy for browsing films.
drop policy if exists "Public can read films" on public."Films";
create policy "Public can read films"
  on public."Films"
  for select
  to anon, authenticated
  using (true);

-- Authenticated users can insert. App also enforces director role in service layer.
drop policy if exists "Authenticated users can insert films" on public."Films";
create policy "Authenticated users can insert films"
  on public."Films"
  for insert
  to authenticated
  with check (true);
