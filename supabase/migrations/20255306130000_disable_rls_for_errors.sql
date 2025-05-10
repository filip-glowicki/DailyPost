-- migration: disable rls for error logging table
-- description: disable row level security on table public.error_logs to allow error logging during backend failures

-- caution: disabling rls can expose sensitive data. This change should only be temporary until the underlying issues are resolved.
-- rollback: to re-enable rls, execute: alter table public.error_logs enable row level security;

alter table public.error_logs disable row level security; 