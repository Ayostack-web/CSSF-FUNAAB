-- Chat spam protection lockdown
-- Date: 2026-08-24
-- Project: Cssf-Funaab
--
-- Run this script in the Supabase SQL editor AFTER deploying the app
-- update that routes chat messages through /api/messages/send.
--
-- Messages are now inserted by the server (rate-limited per IP),
-- so the public direct-insert policy is no longer needed.

begin;

drop policy if exists "messages_public_insert" on public.messages;

commit;
