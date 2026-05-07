-- FESTORAMA complete schema (Supabase/Postgres)
-- Includes: Directors, Members, Films + constraints, indexes, FKs
-- Works with current backend using SUPABASE_ANON_KEY.

begin;

create extension if not exists pgcrypto;

create table if not exists public."Directors" (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  password text not null,
  created_at timestamptz not null default now(),

  constraint directors_name_not_empty check (length(trim(name)) > 0),
  constraint directors_email_not_empty check (length(trim(email)) > 0),
  constraint directors_password_not_empty check (length(trim(password)) > 0)
);

create table if not exists public."Members" (
  id uuid primary key default gen_random_uuid(),
  director_id uuid not null,
  name text not null,
  role text not null,
  created_at timestamptz not null default now(),

  constraint members_name_not_empty check (length(trim(name)) > 0),
  constraint members_role_not_empty check (length(trim(role)) > 0),
  constraint members_director_fk
    foreign key (director_id)
    references public."Directors"(id)
    on delete cascade
);

create table if not exists public."Films" (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  thumbnail_url text not null,
  release_date date not null default current_date,
  views integer not null default 0,
  file_id text not null,
  video_embed_url text not null,
  video_source_url text not null,
  video_source_type text not null default 'embed',
  video_provider text not null default 'google-drive',
  created_by uuid,
  created_at timestamptz not null default now(),

  constraint films_title_not_empty check (length(trim(title)) > 0),
  constraint films_views_non_negative check (views >= 0),
  constraint films_source_type_allowed check (video_source_type in ('embed', 'mp4')),
  constraint films_provider_allowed check (video_provider in ('google-drive', 'external')),
  constraint films_file_id_not_empty check (length(trim(file_id)) > 0),
  constraint films_created_by_fk
    foreign key (created_by)
    references public."Directors"(id)
    on delete set null
);

-- Optional cleanup: remove old Films policies if they exist
drop policy if exists "Public can read films" on public."Films";
drop policy if exists "Authenticated users can insert films" on public."Films";

-- Directors indexes / uniqueness
create unique index if not exists directors_email_unique_idx
  on public."Directors" (lower(email));

create index if not exists directors_created_at_idx
  on public."Directors" (created_at desc);

-- Members indexes
create index if not exists members_director_id_idx
  on public."Members" (director_id);

create index if not exists members_created_at_idx
  on public."Members" (created_at desc);

-- Films indexes
create unique index if not exists films_file_id_unique_idx
  on public."Films" (file_id);

create index if not exists films_created_by_idx
  on public."Films" (created_by);

create index if not exists films_created_at_idx
  on public."Films" (created_at desc);

create index if not exists films_release_date_idx
  on public."Films" (release_date desc);

create index if not exists films_views_idx
  on public."Films" (views desc);

-- Important: current server uses anon key; keep RLS disabled for now
alter table public."Directors" disable row level security;
alter table public."Members" disable row level security;
alter table public."Films" disable row level security;

commit;
