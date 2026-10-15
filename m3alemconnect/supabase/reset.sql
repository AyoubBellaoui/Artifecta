-- ============================================================================
-- M3alem Connect — reset to an empty platform
-- ----------------------------------------------------------------------------
-- WARNING: permanently deletes EVERY account and everything they created
-- (profiles, phone numbers, artisan profiles, quotes, reviews, photos rows,
-- subscriptions). Trades and subscription plans are kept.
--
-- How to use: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- Afterwards, sign up again on the website and promote your admin account:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'your@email.com');
-- ============================================================================

begin;

-- Deleting the login accounts cascades to every table that belongs to a user.
delete from auth.users;

-- Restart quote, review, photo and subscription numbers at 1.
truncate public.quotes, public.reviews, public.portfolio_photos, public.artisan_subscriptions
restart identity;

commit;

-- Check: every count should be 0.
select
  (select count(*) from auth.users) as accounts,
  (select count(*) from public.profiles) as profiles,
  (select count(*) from public.quotes) as quotes,
  (select count(*) from public.reviews) as reviews;
