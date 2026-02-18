-- Add free_session_used flag to profiles.
-- Tracks whether a free (non-subscribed) user has completed their one allowed session.
-- Default false so existing rows are unaffected.
alter table public.profiles
  add column if not exists free_session_used boolean not null default false;
