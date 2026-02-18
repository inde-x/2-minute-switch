# 2-minute-switch

Season 1 MVP for 2-Minute Switch (web app)

## Prerequisites

- Node.js >= 20

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database setup

Migrations live in `supabase/migrations/`. Run them once against your Supabase
project before starting the dev server.

**Supabase CLI**

```bash
supabase db push
```

**No CLI?** Paste each `.sql` file from `supabase/migrations/` into the
[Supabase SQL editor](https://supabase.com/dashboard) in filename order.

See [`docs/ops/runbook.md`](docs/ops/runbook.md) for the full migration index
and the paywall/entitlements testing checklist.
