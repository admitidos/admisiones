# web — admitidos.pe frontend

Next.js 16 (App Router, TypeScript, Tailwind v4) app for admitidos.pe.
Live: https://admitidos.pe

This is one workspace in the monorepo. See the root [`CLAUDE.md`](../../CLAUDE.md) for the
operational contract, [`ROADMAP.md`](../../ROADMAP.md) for what's next, and
[`docs/`](../../docs) for design/database/screen reference.

## Develop

From the **repo root** (pnpm workspace; needs Node 22 — see root `.nvmrc`):

```bash
pnpm dev            # next dev (this app)
pnpm --filter web storybook
```

A `DATABASE_URL` (Postgres) must be set — pages read it via `@admitidos/db`. Local default
is in `.env`; production uses Neon (set in Vercel).

## Architecture

Pages → `features/` → `@admitidos/db`. **Pages never touch the DB directly**; business logic
(percentiles, reachable programs, cutoff tendency) lives in `features/`. Deployed on Vercel
with build config pinned in [`vercel.json`](./vercel.json).
