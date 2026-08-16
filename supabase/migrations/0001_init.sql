-- Linkfolio — initial schema + Row-Level Security
-- Run in the Supabase SQL editor (or `supabase db push`).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id                      uuid primary key references auth.users (id) on delete cascade,
  username                text unique not null,
  display_name            text,
  bio                     text,
  avatar_url              text,
  theme                   text not null default 'default',
  accent_color            text,
  plan                    text not null default 'free',   -- 'free' | 'pro'
  stripe_customer_id      text,
  stripe_subscription_id  text,
  created_at              timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,30}$')
);

create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  url         text not null,
  position    int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists links_profile_idx on public.links (profile_id, position);

create table if not exists public.link_clicks (
  id          bigint generated always as identity primary key,
  link_id     uuid not null references public.links (id) on delete cascade,
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  referrer    text,
  country     text
);
create index if not exists clicks_profile_idx on public.link_clicks (profile_id, created_at);
create index if not exists clicks_link_idx on public.link_clicks (link_id, created_at);

-- ---------------------------------------------------------------------------
-- Row-Level Security  (data is private by default; public read via RPC below)
-- ---------------------------------------------------------------------------

alter table public.profiles    enable row level security;
alter table public.links       enable row level security;
alter table public.link_clicks enable row level security;

-- profiles: owner-only access
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- links: owner-only access
create policy "links_all_own" on public.links
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- clicks: owner can read their own; inserts happen only via register_click()
create policy "clicks_select_own" on public.link_clicks
  for select using (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- Public read: returns only safe fields for a username (bypasses RLS safely)
-- ---------------------------------------------------------------------------

create or replace function public.get_public_page(p_username text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case when p.id is null then null else jsonb_build_object(
    'username',     p.username,
    'display_name', p.display_name,
    'bio',          p.bio,
    'avatar_url',   p.avatar_url,
    'theme',        p.theme,
    'accent_color', p.accent_color,
    'plan',         p.plan,
    'links', coalesce((
      select jsonb_agg(
               jsonb_build_object('id', l.id, 'title', l.title, 'url', l.url)
               order by l.position
             )
      from public.links l
      where l.profile_id = p.id and l.is_active = true
    ), '[]'::jsonb)
  ) end
  from public.profiles p
  where p.username = lower(p_username);
$$;

grant execute on function public.get_public_page(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Public write: log a click safely (derives profile_id from the link)
-- ---------------------------------------------------------------------------

create or replace function public.register_click(
  p_link_id  uuid,
  p_referrer text default null,
  p_country  text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile uuid;
begin
  select profile_id into v_profile
  from public.links
  where id = p_link_id and is_active = true;

  if v_profile is null then
    return;
  end if;

  insert into public.link_clicks (link_id, profile_id, referrer, country)
  values (p_link_id, v_profile, p_referrer, p_country);
end;
$$;

grant execute on function public.register_click(uuid, text, text) to anon, authenticated;
