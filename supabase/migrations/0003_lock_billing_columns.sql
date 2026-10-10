-- Linkfolio — keep billing columns server-only
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- The profiles policies let users insert and update their own row, and table
-- privileges allowed every column, so a signed-in user could set
-- plan = 'pro' (or someone else's stripe_customer_id) straight from the
-- browser. Users now get column-level privileges on the fields the app
-- actually edits; plan and the Stripe columns are written only by the service
-- role (Stripe webhook and checkout route), which bypasses these grants.

revoke insert, update on public.profiles from anon, authenticated;

grant insert (id, username) on public.profiles to authenticated;
grant update (display_name, bio, avatar_url, theme, accent_color) on public.profiles to authenticated;
