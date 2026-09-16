-- ============================================================================
-- M3alem Connect — Supabase schema
-- ----------------------------------------------------------------------------
-- How to use: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- The whole script runs in one transaction, so a failure changes nothing.
-- It can safely be run again.
--
-- After running it, create your account on the website, then make it admin:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'your@email.com');
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- Types
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('client', 'artisan', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'quote_status') then
    create type public.quote_status as enum ('pending', 'viewed', 'responded', 'accepted', 'rejected', 'completed');
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

-- Trades (plumbing, electricity, ...)
create table if not exists public.categories (
  id smallint primary key,
  slug text unique not null,
  name_fr text not null,
  name_ar text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

-- One row per account. Public information only.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'client',
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  city text check (char_length(city) <= 80),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Phone numbers live apart from profiles: a client's number must not be public.
create table if not exists public.contact_details (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  phone text check (char_length(phone) <= 30),
  updated_at timestamptz not null default now()
);

-- Professional information, one row per artisan.
create table if not exists public.artisan_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  category_id smallint not null references public.categories (id),
  bio text check (char_length(bio) <= 2000),
  years_experience smallint not null default 0 check (years_experience between 0 and 60),
  hourly_rate numeric(10, 2) check (hourly_rate >= 0 and hourly_rate <= 100000),
  is_available boolean not null default true,
  is_verified boolean not null default false,
  service_areas text[] not null default '{}' check (cardinality(service_areas) <= 20),
  skills text[] not null default '{}' check (cardinality(skills) <= 20),
  total_jobs integer not null default 0 check (total_jobs >= 0),
  rating_avg numeric(3, 2) not null default 0 check (rating_avg between 0 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  views_count integer not null default 0 check (views_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artisan_profiles_category_idx on public.artisan_profiles (category_id);
create index if not exists artisan_profiles_rating_idx on public.artisan_profiles (rating_avg desc);

-- Photos of finished work. The file itself lives in the "portfolio" storage bucket.
create table if not exists public.portfolio_photos (
  id bigint generated always as identity primary key,
  artisan_id uuid not null references public.artisan_profiles (user_id) on delete cascade,
  storage_path text not null,
  caption text check (char_length(caption) <= 160),
  created_at timestamptz not null default now()
);

create index if not exists portfolio_photos_artisan_idx on public.portfolio_photos (artisan_id);

create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  artisan_id uuid not null references public.artisan_profiles (user_id) on delete cascade,
  client_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  is_approved boolean not null default true,
  created_at timestamptz not null default now(),
  unique (artisan_id, client_id)
);

create index if not exists reviews_artisan_idx on public.reviews (artisan_id);

create table if not exists public.quotes (
  id bigint generated always as identity primary key,
  artisan_id uuid not null references public.artisan_profiles (user_id) on delete cascade,
  client_id uuid not null references public.profiles (id) on delete cascade,
  description text not null check (char_length(description) between 10 and 2000),
  city text check (char_length(city) <= 80),
  budget_min numeric(10, 2) check (budget_min >= 0),
  budget_max numeric(10, 2) check (budget_max >= 0),
  status public.quote_status not null default 'pending',
  artisan_response text check (char_length(artisan_response) <= 2000),
  artisan_price numeric(10, 2) check (artisan_price >= 0),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (budget_min is null or budget_max is null or budget_max >= budget_min)
);

create index if not exists quotes_artisan_idx on public.quotes (artisan_id, created_at desc);
create index if not exists quotes_client_idx on public.quotes (client_id, created_at desc);

create table if not exists public.subscription_plans (
  id smallint primary key,
  code text unique not null check (code in ('free', 'pro', 'premium')),
  name text not null,
  price numeric(10, 2) not null default 0 check (price >= 0),
  duration_days integer not null default 30 check (duration_days > 0),
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order smallint not null default 0
);

-- Concept project: subscribing is free and instant, there is no payment step yet.
create table if not exists public.artisan_subscriptions (
  id bigint generated always as identity primary key,
  artisan_id uuid not null references public.artisan_profiles (user_id) on delete cascade,
  plan_id smallint not null references public.subscription_plans (id),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists artisan_subscriptions_artisan_idx on public.artisan_subscriptions (artisan_id, is_active);

-- ----------------------------------------------------------------------------
-- Helper functions (used by the security rules below)
-- ----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin' and p.is_active
  );
$$;

create or replace function public.current_user_role()
returns public.user_role language sql stable security definer set search_path = public, pg_temp as $$
  select p.role from public.profiles p where p.id = (select auth.uid());
$$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce((select p.is_active from public.profiles p where p.id = (select auth.uid())), false);
$$;

create or replace function public.is_active_artisan(p_artisan_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.artisan_profiles a
    join public.profiles p on p.id = a.user_id
    where a.user_id = p_artisan_id and p.is_active
  );
$$;

create or replace function public.artisan_is_premium(p_artisan_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.artisan_subscriptions s
    join public.subscription_plans sp on sp.id = s.plan_id
    where s.artisan_id = p_artisan_id and s.is_active and s.ends_at > now() and sp.price > 0
  );
$$;

-- A profile is public for artisans; clients stay private except for the people they dealt with.
create or replace function public.can_view_profile(p_profile_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select
    p_profile_id = (select auth.uid())
    or public.is_admin()
    or exists (select 1 from public.profiles p where p.id = p_profile_id and p.role = 'artisan' and p.is_active)
    or exists (select 1 from public.reviews r where r.client_id = p_profile_id and r.is_approved)
    or exists (
      select 1 from public.quotes q
      where (q.client_id = p_profile_id and q.artisan_id = (select auth.uid()))
         or (q.artisan_id = p_profile_id and q.client_id = (select auth.uid()))
    );
$$;

-- An artisan's phone is a business number; a client's is visible only to artisans they contacted.
create or replace function public.can_view_contact(p_user_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select
    p_user_id = (select auth.uid())
    or public.is_admin()
    or exists (
      select 1 from public.artisan_profiles a
      join public.profiles p on p.id = a.user_id
      where a.user_id = p_user_id and p.is_active
    )
    or exists (
      select 1 from public.quotes q
      where q.client_id = p_user_id and q.artisan_id = (select auth.uid())
    );
$$;

-- Reviews come from clients who actually requested a quote from that artisan.
create or replace function public.can_review_artisan(p_artisan_id uuid)
returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select
    public.current_user_role() = 'client'
    and public.is_active_user()
    and exists (
      select 1 from public.quotes q
      where q.artisan_id = p_artisan_id and q.client_id = (select auth.uid())
    )
    and not exists (
      select 1 from public.reviews r
      where r.artisan_id = p_artisan_id and r.client_id = (select auth.uid())
    );
$$;

-- ----------------------------------------------------------------------------
-- Views (read models used by the website)
-- ----------------------------------------------------------------------------

create or replace view public.artisan_directory with (security_invoker = true) as
select
  p.id,
  p.first_name,
  p.last_name,
  p.city,
  p.avatar_url,
  p.created_at,
  a.category_id,
  c.slug as category_slug,
  c.name_fr as category_name_fr,
  c.name_ar as category_name_ar,
  a.bio,
  a.years_experience,
  a.hourly_rate,
  a.is_available,
  a.is_verified,
  a.service_areas,
  a.skills,
  a.total_jobs,
  a.rating_avg,
  a.rating_count,
  a.views_count,
  public.artisan_is_premium(a.user_id) as is_premium
from public.artisan_profiles a
join public.profiles p on p.id = a.user_id
join public.categories c on c.id = a.category_id
where p.is_active and p.role = 'artisan';

create or replace view public.categories_with_counts with (security_invoker = true) as
select
  c.id,
  c.slug,
  c.name_fr,
  c.name_ar,
  c.sort_order,
  (select count(*) from public.artisan_directory d where d.category_id = c.id)::integer as artisan_count
from public.categories c;

create or replace view public.quote_details with (security_invoker = true) as
select
  q.id,
  q.artisan_id,
  q.client_id,
  q.description,
  q.city,
  q.budget_min,
  q.budget_max,
  q.status,
  q.artisan_response,
  q.artisan_price,
  q.responded_at,
  q.created_at,
  q.updated_at,
  cp.first_name as client_first_name,
  cp.last_name as client_last_name,
  cp.city as client_city,
  cp.avatar_url as client_avatar_url,
  cd.phone as client_phone,
  ap.first_name as artisan_first_name,
  ap.last_name as artisan_last_name,
  ap.avatar_url as artisan_avatar_url,
  c.slug as category_slug,
  c.name_fr as category_name_fr
from public.quotes q
left join public.profiles cp on cp.id = q.client_id
left join public.contact_details cd on cd.user_id = q.client_id
left join public.profiles ap on ap.id = q.artisan_id
left join public.artisan_profiles a on a.user_id = q.artisan_id
left join public.categories c on c.id = a.category_id;

create or replace view public.review_details with (security_invoker = true) as
select
  r.id,
  r.artisan_id,
  r.client_id,
  r.rating,
  r.comment,
  r.is_approved,
  r.created_at,
  cp.first_name as client_first_name,
  cp.last_name as client_last_name,
  cp.avatar_url as client_avatar_url,
  ap.first_name as artisan_first_name,
  ap.last_name as artisan_last_name
from public.reviews r
left join public.profiles cp on cp.id = r.client_id
left join public.profiles ap on ap.id = r.artisan_id;

-- ----------------------------------------------------------------------------
-- Read functions
-- ----------------------------------------------------------------------------

create or replace function public.search_artisans(
  p_search text default null,
  p_city text default null,
  p_category text default null,
  p_min_rating numeric default null,
  p_available boolean default null,
  p_sort text default 'rating',
  p_limit integer default 12,
  p_offset integer default 0
) returns jsonb language sql stable security invoker set search_path = public, pg_temp as $$
  with filtered as (
    select d.*
    from public.artisan_directory d
    where (p_category is null or d.category_slug = p_category)
      and (p_min_rating is null or d.rating_avg >= p_min_rating)
      and (p_available is null or d.is_available = p_available)
      and (
        p_city is null
        or lower(btrim(coalesce(d.city, ''))) = lower(btrim(p_city))
        or exists (select 1 from unnest(d.service_areas) area where lower(btrim(area)) = lower(btrim(p_city)))
      )
      and (
        p_search is null
        or concat_ws(' ', d.first_name, d.last_name, d.bio, d.category_name_fr, d.category_name_ar)
           ilike '%' || replace(replace(p_search, '%', '\%'), '_', '\_') || '%'
      )
  ),
  ranked as (
    select f.*, row_number() over (
      order by
        f.is_premium desc,
        case when p_sort = 'jobs' then f.total_jobs end desc nulls last,
        case when p_sort = 'newest' then f.created_at end desc nulls last,
        f.rating_avg desc,
        f.rating_count desc,
        f.created_at desc
    ) as rn
    from filtered f
  ),
  page as (
    select * from ranked
    where rn > greatest(coalesce(p_offset, 0), 0)
      and rn <= greatest(coalesce(p_offset, 0), 0) + greatest(least(coalesce(p_limit, 12), 48), 1)
  )
  select jsonb_build_object(
    'total', (select count(*) from filtered),
    'artisans', coalesce((select jsonb_agg(to_jsonb(page) - 'rn' order by page.rn) from page), '[]'::jsonb)
  );
$$;

create or replace function public.get_artisan_profile(p_artisan_id uuid)
returns jsonb language sql stable security invoker set search_path = public, pg_temp as $$
  select to_jsonb(d) || jsonb_build_object(
    'phone', (select cd.phone from public.contact_details cd where cd.user_id = d.id),
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ph.id, 'storage_path', ph.storage_path, 'caption', ph.caption, 'created_at', ph.created_at
      ) order by ph.created_at desc)
      from public.portfolio_photos ph where ph.artisan_id = d.id
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'rating', r.rating, 'comment', r.comment, 'created_at', r.created_at,
        'first_name', r.client_first_name, 'last_name', r.client_last_name, 'avatar_url', r.client_avatar_url
      ) order by r.created_at desc)
      from public.review_details r where r.artisan_id = d.id and r.is_approved
    ), '[]'::jsonb)
  )
  from public.artisan_directory d
  where d.id = p_artisan_id;
$$;

-- Everything the signed-in user needs about their own account.
create or replace function public.get_my_profile()
returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'id', p.id,
    'role', p.role,
    'first_name', p.first_name,
    'last_name', p.last_name,
    'city', p.city,
    'avatar_url', p.avatar_url,
    'is_active', p.is_active,
    'created_at', p.created_at,
    'phone', cd.phone,
    'category_id', a.category_id,
    'category_slug', c.slug,
    'category_name', c.name_fr,
    'bio', a.bio,
    'years_experience', a.years_experience,
    'hourly_rate', a.hourly_rate,
    'is_available', a.is_available,
    'is_verified', a.is_verified,
    'service_areas', a.service_areas,
    'skills', a.skills,
    'total_jobs', a.total_jobs,
    'rating_avg', a.rating_avg,
    'rating_count', a.rating_count,
    'views_count', a.views_count,
    'is_premium', case when a.user_id is null then false else public.artisan_is_premium(a.user_id) end,
    'subscription', (
      select jsonb_build_object(
        'id', s.id, 'plan_id', s.plan_id, 'plan_code', sp.code, 'plan_name', sp.name,
        'price', sp.price, 'starts_at', s.starts_at, 'ends_at', s.ends_at
      )
      from public.artisan_subscriptions s
      join public.subscription_plans sp on sp.id = s.plan_id
      where s.artisan_id = p.id and s.is_active and s.ends_at > now()
      order by s.ends_at desc
      limit 1
    )
  )
  from public.profiles p
  left join public.contact_details cd on cd.user_id = p.id
  left join public.artisan_profiles a on a.user_id = p.id
  left join public.categories c on c.id = a.category_id
  where p.id = (select auth.uid());
$$;

-- ----------------------------------------------------------------------------
-- Write functions (the business rules live here, not in the browser)
-- ----------------------------------------------------------------------------

create or replace function public.record_profile_view(p_artisan_id uuid)
returns void language sql volatile security definer set search_path = public, pg_temp as $$
  update public.artisan_profiles
  set views_count = views_count + 1
  where user_id = p_artisan_id
    and (select auth.uid()) is distinct from p_artisan_id;
$$;

create or replace function public.mark_quotes_viewed()
returns void language sql volatile security definer set search_path = public, pg_temp as $$
  update public.quotes
  set status = 'viewed', updated_at = now()
  where artisan_id = (select auth.uid()) and status = 'pending';
$$;

create or replace function public.respond_to_quote(
  p_quote_id bigint,
  p_response text,
  p_price numeric default null,
  p_decision text default 'responded'
) returns jsonb language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_quote public.quotes;
begin
  if p_decision not in ('responded', 'rejected') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;
  if char_length(btrim(coalesce(p_response, ''))) < 5 then
    raise exception 'response_too_short' using errcode = '22023';
  end if;
  if p_price is not null and (p_price < 0 or p_price > 10000000) then
    raise exception 'invalid_price' using errcode = '22023';
  end if;
  if not public.is_active_user() then
    raise exception 'account_disabled' using errcode = '42501';
  end if;

  update public.quotes q
  set status = p_decision::public.quote_status,
      artisan_response = btrim(p_response),
      artisan_price = case when p_decision = 'responded' then p_price else null end,
      responded_at = now(),
      updated_at = now()
  where q.id = p_quote_id
    and q.artisan_id = (select auth.uid())
    and q.status in ('pending', 'viewed')
  returning * into v_quote;

  if v_quote.id is null then
    raise exception 'quote_not_available' using errcode = 'P0002';
  end if;

  return to_jsonb(v_quote);
end;
$$;

create or replace function public.accept_quote(p_quote_id bigint)
returns jsonb language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_quote public.quotes;
begin
  update public.quotes q
  set status = 'accepted', updated_at = now()
  where q.id = p_quote_id
    and q.client_id = (select auth.uid())
    and q.status = 'responded'
  returning * into v_quote;

  if v_quote.id is null then
    raise exception 'quote_not_available' using errcode = 'P0002';
  end if;

  return to_jsonb(v_quote);
end;
$$;

create or replace function public.complete_quote(p_quote_id bigint)
returns jsonb language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_quote public.quotes;
begin
  update public.quotes q
  set status = 'completed', updated_at = now()
  where q.id = p_quote_id
    and q.client_id = (select auth.uid())
    and q.status = 'accepted'
  returning * into v_quote;

  if v_quote.id is null then
    raise exception 'quote_not_available' using errcode = 'P0002';
  end if;

  update public.artisan_profiles
  set total_jobs = total_jobs + 1
  where user_id = v_quote.artisan_id;

  return to_jsonb(v_quote);
end;
$$;

create or replace function public.subscribe_to_plan(p_plan_id smallint)
returns jsonb language plpgsql volatile security definer set search_path = public, pg_temp as $$
declare
  v_plan public.subscription_plans;
  v_subscription public.artisan_subscriptions;
begin
  if public.current_user_role() <> 'artisan' or not public.is_active_user() then
    raise exception 'artisans_only' using errcode = '42501';
  end if;

  select * into v_plan from public.subscription_plans where id = p_plan_id and is_active;
  if v_plan.id is null then
    raise exception 'plan_not_found' using errcode = 'P0002';
  end if;

  update public.artisan_subscriptions
  set is_active = false
  where artisan_id = (select auth.uid()) and is_active;

  -- The free plan simply means "no paid subscription".
  if v_plan.price > 0 then
    insert into public.artisan_subscriptions (artisan_id, plan_id, starts_at, ends_at)
    values ((select auth.uid()), v_plan.id, now(), now() + make_interval(days => v_plan.duration_days))
    returning * into v_subscription;
  end if;

  return jsonb_build_object(
    'plan_id', v_plan.id,
    'plan_code', v_plan.code,
    'plan_name', v_plan.name,
    'price', v_plan.price,
    'ends_at', v_subscription.ends_at
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- Admin functions
-- ----------------------------------------------------------------------------

create or replace function public.admin_stats()
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'users', (select count(*) from public.profiles where role <> 'admin'),
    'artisans', (select count(*) from public.artisan_profiles),
    'clients', (select count(*) from public.profiles where role = 'client'),
    'quotes', (select count(*) from public.quotes),
    'reviews', (select count(*) from public.reviews),
    'premium', (
      select count(*) from public.artisan_subscriptions s
      join public.subscription_plans sp on sp.id = s.plan_id
      where s.is_active and s.ends_at > now() and sp.price > 0
    ),
    'recentUsers', coalesce((
      select jsonb_agg(u order by u.created_at desc)
      from (
        select p.id, p.first_name, p.last_name, p.role, p.city, p.created_at, au.email
        from public.profiles p
        join auth.users au on au.id = p.id
        where p.role <> 'admin'
        order by p.created_at desc
        limit 5
      ) u
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.admin_list_users(
  p_role text default null,
  p_search text default null,
  p_limit integer default 50
) returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return coalesce((
    select jsonb_agg(u order by u.created_at desc)
    from (
      select
        p.id, p.first_name, p.last_name, p.role, p.city, p.is_active, p.created_at,
        au.email, cd.phone,
        coalesce(a.is_verified, false) as is_verified
      from public.profiles p
      join auth.users au on au.id = p.id
      left join public.contact_details cd on cd.user_id = p.id
      left join public.artisan_profiles a on a.user_id = p.id
      where p.role <> 'admin'
        and (p_role is null or p.role::text = p_role)
        and (
          p_search is null
          or concat_ws(' ', p.first_name, p.last_name, au.email)
             ilike '%' || replace(replace(p_search, '%', '\%'), '_', '\_') || '%'
        )
      order by p.created_at desc
      limit greatest(least(coalesce(p_limit, 50), 200), 1)
    ) u
  ), '[]'::jsonb);
end;
$$;

create or replace function public.admin_set_user_active(p_user_id uuid, p_active boolean)
returns void language plpgsql volatile security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_user_id = (select auth.uid()) then
    raise exception 'cannot_target_self' using errcode = '42501';
  end if;

  update public.profiles
  set is_active = p_active, updated_at = now()
  where id = p_user_id and role <> 'admin';

  if not found then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.admin_verify_artisan(p_user_id uuid)
returns void language plpgsql volatile security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  update public.artisan_profiles
  set is_verified = true, updated_at = now()
  where user_id = p_user_id;

  if not found then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;
end;
$$;

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists artisan_profiles_set_updated_at on public.artisan_profiles;
create trigger artisan_profiles_set_updated_at before update on public.artisan_profiles
for each row execute function public.set_updated_at();

drop trigger if exists contact_details_set_updated_at on public.contact_details;
create trigger contact_details_set_updated_at before update on public.contact_details
for each row execute function public.set_updated_at();

-- Ratings are computed from the reviews table, never written by the browser.
create or replace function public.refresh_artisan_rating()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_artisan uuid := coalesce(new.artisan_id, old.artisan_id);
begin
  update public.artisan_profiles ap
  set rating_avg = coalesce((
        select round(avg(r.rating)::numeric, 2) from public.reviews r
        where r.artisan_id = v_artisan and r.is_approved
      ), 0),
      rating_count = (
        select count(*) from public.reviews r
        where r.artisan_id = v_artisan and r.is_approved
      )
  where ap.user_id = v_artisan;
  return null;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating after insert or update or delete on public.reviews
for each row execute function public.refresh_artisan_rating();

-- A new account in Supabase Auth creates the matching profile rows.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role public.user_role;
  v_first text;
  v_last text;
  v_city text;
  v_phone text;
  v_category smallint;
begin
  v_role := case when meta ->> 'role' = 'artisan' then 'artisan'::public.user_role else 'client'::public.user_role end;
  v_first := nullif(btrim(coalesce(meta ->> 'first_name', '')), '');
  v_last := nullif(btrim(coalesce(meta ->> 'last_name', '')), '');
  v_city := nullif(btrim(coalesce(meta ->> 'city', '')), '');
  v_phone := nullif(regexp_replace(coalesce(meta ->> 'phone', ''), '[^0-9+]', '', 'g'), '');

  insert into public.profiles (id, role, first_name, last_name, city)
  values (
    new.id,
    v_role,
    left(coalesce(v_first, split_part(coalesce(new.email, 'utilisateur'), '@', 1)), 80),
    left(coalesce(v_last, ''), 80),
    left(v_city, 80)
  )
  on conflict (id) do nothing;

  if v_phone is not null then
    insert into public.contact_details (user_id, phone)
    values (new.id, left(v_phone, 30))
    on conflict (user_id) do update set phone = excluded.phone;
  end if;

  if v_role = 'artisan' then
    if meta ->> 'category_id' ~ '^[0-9]{1,5}$' then
      v_category := (meta ->> 'category_id')::smallint;
    end if;
    if v_category is null or not exists (select 1 from public.categories where id = v_category) then
      raise exception 'artisan_category_required' using errcode = '22023';
    end if;

    insert into public.artisan_profiles (user_id, category_id, bio, years_experience, hourly_rate)
    values (
      new.id,
      v_category,
      left(nullif(btrim(coalesce(meta ->> 'bio', '')), ''), 2000),
      case when meta ->> 'years_experience' ~ '^[0-9]{1,2}$'
           then least((meta ->> 'years_experience')::smallint, 60) else 0 end,
      case when meta ->> 'hourly_rate' ~ '^[0-9]{1,6}(\.[0-9]{1,2})?$'
           then (meta ->> 'hourly_rate')::numeric else null end
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row level security
-- ----------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.contact_details enable row level security;
alter table public.artisan_profiles enable row level security;
alter table public.portfolio_photos enable row level security;
alter table public.reviews enable row level security;
alter table public.quotes enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.artisan_subscriptions enable row level security;

drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using (true);

drop policy if exists plans_read on public.subscription_plans;
create policy plans_read on public.subscription_plans for select using (is_active or public.is_admin());

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (public.can_view_profile(id));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using (id = (select auth.uid()) and public.is_active_user())
  with check (id = (select auth.uid()));

drop policy if exists contacts_read on public.contact_details;
create policy contacts_read on public.contact_details for select using (public.can_view_contact(user_id));

drop policy if exists contacts_insert_own on public.contact_details;
create policy contacts_insert_own on public.contact_details for insert
  with check (user_id = (select auth.uid()));

drop policy if exists contacts_update_own on public.contact_details;
create policy contacts_update_own on public.contact_details for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists artisans_read on public.artisan_profiles;
create policy artisans_read on public.artisan_profiles for select using (
  user_id = (select auth.uid())
  or public.is_admin()
  or exists (select 1 from public.profiles p where p.id = user_id and p.is_active and p.role = 'artisan')
);

drop policy if exists artisans_update_own on public.artisan_profiles;
create policy artisans_update_own on public.artisan_profiles for update
  using (user_id = (select auth.uid()) and public.is_active_user())
  with check (user_id = (select auth.uid()));

drop policy if exists photos_read on public.portfolio_photos;
create policy photos_read on public.portfolio_photos for select using (true);

drop policy if exists photos_insert_own on public.portfolio_photos;
create policy photos_insert_own on public.portfolio_photos for insert with check (
  artisan_id = (select auth.uid())
  and public.current_user_role() = 'artisan'
  and public.is_active_user()
  and storage_path like ((select auth.uid())::text || '/%')
);

drop policy if exists photos_delete_own on public.portfolio_photos;
create policy photos_delete_own on public.portfolio_photos for delete using (
  artisan_id = (select auth.uid()) or public.is_admin()
);

drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select using (
  is_approved or client_id = (select auth.uid()) or public.is_admin()
);

drop policy if exists reviews_insert_client on public.reviews;
create policy reviews_insert_client on public.reviews for insert with check (
  client_id = (select auth.uid()) and public.can_review_artisan(artisan_id)
);

drop policy if exists reviews_delete on public.reviews;
create policy reviews_delete on public.reviews for delete using (
  client_id = (select auth.uid()) or public.is_admin()
);

drop policy if exists quotes_read on public.quotes;
create policy quotes_read on public.quotes for select using (
  client_id = (select auth.uid()) or artisan_id = (select auth.uid()) or public.is_admin()
);

drop policy if exists quotes_insert_client on public.quotes;
create policy quotes_insert_client on public.quotes for insert with check (
  client_id = (select auth.uid())
  and public.current_user_role() = 'client'
  and public.is_active_user()
  and artisan_id <> (select auth.uid())
  and public.is_active_artisan(artisan_id)
);

drop policy if exists subscriptions_read on public.artisan_subscriptions;
create policy subscriptions_read on public.artisan_subscriptions for select using (
  artisan_id = (select auth.uid()) or public.is_admin()
);

-- ----------------------------------------------------------------------------
-- Privileges: only these columns can be written from the browser
-- ----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

revoke all on public.categories, public.profiles, public.contact_details, public.artisan_profiles,
  public.portfolio_photos, public.reviews, public.quotes, public.subscription_plans,
  public.artisan_subscriptions from anon, authenticated;

grant select on public.categories, public.subscription_plans, public.profiles,
  public.artisan_profiles, public.portfolio_photos, public.reviews to anon, authenticated;
grant select on public.quotes, public.artisan_subscriptions to authenticated;
-- Visitors see an artisan's business phone on the profile page; the row rules above keep
-- client phone numbers visible only to themselves, to admins and to the artisan they contacted.
grant select on public.contact_details to anon, authenticated;

grant select on public.artisan_directory, public.categories_with_counts to anon, authenticated;
grant select on public.quote_details, public.review_details to authenticated;
grant select on public.review_details to anon;

grant update (first_name, last_name, city, avatar_url) on public.profiles to authenticated;
grant insert (user_id, phone), update (phone) on public.contact_details to authenticated;
grant update (category_id, bio, years_experience, hourly_rate, is_available, service_areas, skills)
  on public.artisan_profiles to authenticated;
grant insert (artisan_id, client_id, description, city, budget_min, budget_max) on public.quotes to authenticated;
grant insert (artisan_id, client_id, rating, comment), delete on public.reviews to authenticated;
grant insert (artisan_id, storage_path, caption), delete on public.portfolio_photos to authenticated;

-- Internal helpers must not be callable through the API.
revoke execute on function public.handle_new_user(), public.set_updated_at(),
  public.refresh_artisan_rating() from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- Storage bucket for portfolio photos
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio upload own folder" on storage.objects;
create policy "portfolio upload own folder" on storage.objects for insert to authenticated
with check (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and public.current_user_role() = 'artisan'
);

drop policy if exists "portfolio delete own folder" on storage.objects;
create policy "portfolio delete own folder" on storage.objects for delete to authenticated
using (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- ----------------------------------------------------------------------------
-- Seed data
-- ----------------------------------------------------------------------------

insert into public.categories (id, slug, name_fr, name_ar, sort_order) values
  (1, 'plomberie', 'Plomberie', 'السباكة', 1),
  (2, 'electricite', 'Électricité', 'الكهرباء', 2),
  (3, 'menuiserie', 'Menuiserie', 'النجارة', 3),
  (4, 'peinture', 'Peinture', 'الصباغة', 4),
  (5, 'maconnerie', 'Maçonnerie', 'البناء', 5),
  (6, 'reparation', 'Réparation d''appareils', 'إصلاح الأجهزة', 6),
  (7, 'demenagement', 'Déménagement', 'نقل الأثاث', 7),
  (8, 'nettoyage', 'Nettoyage', 'التنظيف', 8)
on conflict (id) do update
set slug = excluded.slug, name_fr = excluded.name_fr, name_ar = excluded.name_ar, sort_order = excluded.sort_order;

insert into public.subscription_plans (id, code, name, price, duration_days, features, sort_order) values
  (1, 'free', 'Gratuit', 0, 30,
   '["Profil public","Visible dans les résultats de recherche","Jusqu''à 5 demandes de devis par mois","Assistance par e-mail"]'::jsonb, 1),
  (2, 'pro', 'Pro', 199, 30,
   '["Profil mis en avant","Badge Pro","Demandes de devis illimitées","Statistiques de visibilité","Assistance prioritaire"]'::jsonb, 2),
  (3, 'premium', 'Premium', 399, 30,
   '["Position prioritaire dans les résultats","Badge Premium","Demandes de devis illimitées","Statistiques détaillées","Mise en avant dans votre catégorie","Conseiller dédié"]'::jsonb, 3)
on conflict (id) do update
set code = excluded.code, name = excluded.name, price = excluded.price,
    duration_days = excluded.duration_days, features = excluded.features, sort_order = excluded.sort_order;

commit;
