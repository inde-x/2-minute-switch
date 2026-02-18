# Ops Runbook

## Database migrations

Migrations live in `supabase/migrations/` and are plain SQL files with a
`YYYYMMDD_<slug>.sql` name prefix so they sort chronologically.

### Running migrations

**Option A — Supabase CLI (recommended for CI / team)**

```bash
# link once per machine (uses the project ref from supabase/config.toml or --project-ref flag)
supabase db push
```

**Option B — Supabase dashboard SQL editor (quick / no CLI needed)**

Paste each file in `supabase/migrations/` into the SQL editor in order and run.

---

### Migration index

| File | Purpose |
|------|---------|
| `20260218_add_free_session_used.sql` | Adds `free_session_used boolean NOT NULL DEFAULT false` to `public.profiles`. Tracks whether a free user has consumed their one complimentary session. |
| `20260218_add_profiles_update_policy.sql` | RLS `UPDATE` policy — `"Users can update own profile"` — so authenticated users can write to their own `profiles` row (required for marking `free_session_used = true`). Idempotent. |

---

## Paywall / entitlements — local testing checklist

After running both migrations above:

1. **Paid user flow**
   - Set `subscription_status = 'trialing'` (or `'active'`) on a test profile row.
   - Navigate to `/switch/1` — should load with no redirect.

2. **Free user — first session allowed**
   - Ensure `subscription_status = 'none'` and `free_session_used = false`.
   - Complete the full flow: step 1 (before-rating) → step 2 → step 3 (protocol + after-rating).
   - After selecting the after-rating, `profiles.free_session_used` flips to `true` (verify in Supabase table editor).

3. **Free user — blocked after session used**
   - With `free_session_used = true` and no active subscription, navigate to `/switch/1`.
   - Should redirect to `/paywall?next=%2Fswitch%2F1`.
   - Browser console shows `[analytics] paywall_gate_triggered`.

4. **Unauthenticated user**
   - Log out, navigate to `/switch/2`.
   - Should redirect to `/login?next=%2Fswitch%2F2`.

> **If `free_session_used` is not updating:** confirm the RLS UPDATE policy exists.
> Run `select * from pg_policies where tablename = 'profiles';` in the SQL editor.
> If the `"Users can update own profile"` row is missing, run
> `supabase/migrations/20260218_add_profiles_update_policy.sql` manually.

---

## Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Trigger a test subscription event:

```bash
stripe trigger customer.subscription.created
```
