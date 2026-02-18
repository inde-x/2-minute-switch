-- Allow each authenticated user to update their own row in public.profiles.
-- Required for: marking free_session_used = true after a free session completes.
--
-- Idempotent: the DO $$ block checks pg_policies first so re-running this
-- migration (e.g. via `supabase db reset`) never raises a duplicate-policy error.

do $$
begin
  if not exists (
    select 1
    from   pg_policies
    where  schemaname = 'public'
      and  tablename  = 'profiles'
      and  policyname = 'Users can update own profile'
  ) then
    execute $policy$
      create policy "Users can update own profile"
        on public.profiles
        for update
        using      (auth.uid() = id)
        with check (auth.uid() = id)
    $policy$;
  end if;
end;
$$;
