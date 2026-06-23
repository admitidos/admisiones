# admitidos.pe — Roadmap (ship-first)

> **The single source of truth for *what to do next and in what order*.** Ship list,
> not a spec. `PRODUCT.md` = why; `CLAUDE.md` = how; `docs/*` = reference; this = sequence.
> Last reconciled against the code: 2026-06-22.

## The one thing that matters

The product has **never been deployed.** It runs only on localhost. Every screen
the MVP needs already exists — so the only work that counts right now is getting it
**live behind a real URL with real data and a couple of events.** Anything that
isn't on the NOW list below is a distraction until that happens.

---

## Reality snapshot (what's already built — stop rebuilding it)

| Area | State |
|---|---|
| Routes: home, process, program, result, `proximos-examenes`, OG image, empathetic 404s | ✅ built |
| Feature functions: `getHomeData`, `getProcessData`, `getResultData`, `getCalendarData` | ✅ built |
| Real UNMSM data wired into home / process / program pages | ✅ done |
| **Individual result page wired to real data** (`getResultData`) | ✅ done (2026-06-22) — verified vs real codes; bogus → 404 |
| Scraper → DB pipeline (`pnpm pipeline:unmsm`: scrape → `loaders/seed*`) | ✅ works |
| Vercel Analytics (auto pageviews) | ✅ installed in `layout.tsx` |
| **Custom analytics events** (`result_viewed`, `share_click`) | ✅ done (2026-06-22) |
| Design system (Degradado índigo tokens, fonts, hero) | ✅ in `globals.css` |
| **Production database (Neon)** | ✅ provisioned + migrated + 136,600 applicants loaded |
| **Deployed to Vercel** | ❌ never — needs `vercel login` (interactive, user) |

The only remaining gap to "live" is **the Vercel deploy itself** (needs your login).

---

## NOW — the critical path to first deploy (target: this week)

Do these in order. Each one is ship-gating; nothing here is optional.

0. **Wire `getResultData` to the DB.** ⚠️ The result page — the core of the product on
   result day — is still mock-only. This is real feature work (the app's richest query:
   percentile in program/área, score distribution, reachable programs, historical cutoffs,
   tendency), following the `getProcessData` pattern. Product rules live in `PRODUCT.md` §8.
   **Without this, a real applicant typing their code gets a 404.** Highest-priority gap.
1. **Provision a production Postgres.** Use **Neon** (serverless Postgres, Prisma-ready,
   Vercel integration). → *resolves the stale "Turso vs Neon" open question — see Decisions._
2. **Apply schema to prod.** `prisma migrate deploy` against the Neon `DATABASE_URL`.
3. **Load real UNMSM data into prod.** Run `pnpm pipeline:unmsm` (or `pnpm db:seed` if the
   scraped CSVs are already present) pointed at the prod `DATABASE_URL`. UNMSM is the only
   `active` university — that **is** the smallest deployable slice. UNI stays `coming_soon`.
4. **Deploy `apps/web` to Vercel.** Set root/install for the pnpm monorepo so
   `prisma generate` runs on install; set the `DATABASE_URL` env var in Vercel.
5. **Add the two events that test the thesis** (Vercel Analytics `track()`):
   - `result_viewed` with `{ status, university, modalidad }` — does the contextualized
     result land, and for which of the 4 statuses?
   - `share_click` with `{ status }` — the core "did it change how they feel" proxy,
     in **both** admitted and not-admitted states.
   That's it for v0. Resist adding more until traffic asks a question.
6. **Smoke-test the 4 critical routes on a real phone** (home, a process table, a
   real applicant result, `proximos-examenes`). Mobile-first is non-negotiable.
7. **Ship on the `*.vercel.app` URL.** A custom domain is *not* a launch blocker.

---

## NEXT — right after first real traffic (days, not weeks)

- **Register + point the `admitidos.pe` domain** (verify availability first).
- **Watch the result-day funnel.** Let real behaviour — not guessing — pick the next
  build. Add at most 1–2 more events only if a specific question emerges.
- **Decide on UNI.** Its results portal keeps data only ~60 days after publication, so
  scraping is time-sensitive — but UNI is small (~6k) and `coming_soon`. Either rush the
  scrape before the window closes or consciously skip it for this cycle. Don't drift.
- **Replace the create-next-app boilerplate `apps/web/README.md`** with one line + a link
  here. (Trivial; do it when convenient, not before ship.)

---

## LATER — explicitly parked (do NOT build before launch)

These are real and good. They are also exactly the work that has kept this from shipping.
Each stays here until first traffic proves it's the right next bet.

- **Phase 2:** University hub · Career-statistics storytelling page · Global search
  (Pagefind) · Stats dashboard.
- **Phase 3:** Pre-exam simulator · multi-university home redesign.
- **Exam-prep SaaS track** (separate product) + monetization (Culqi pricing above
  S/30–50 for unit economics). See `PRODUCT.md` §3b, §15.
- **CI/CD automation:** GitHub Actions cron to re-scrape when new results drop + auto
  deploy. The scraper runs 2–3×/year — manual is fine until that cadence actually hurts.

---

## Decisions reconciled (these supersede older docs)

- **Prod DB = Neon (serverless Postgres).** Turso is rejected — it is libSQL/SQLite, which
  violates the repo's "PostgreSQL, no SQLite" rule. This closes `PRODUCT.md` §16 Q3.
- **Analytics tool = Vercel Analytics** (already installed). The "PostHog / GA4 / Mixpanel —
  undecided" notes in `PRODUCT.md` are obsolete. v0 event taxonomy is the two events above.
- **First launch = UNMSM only.** UNI is a NEXT decision, gated on its 60-day scrape window.

---

## What moved (doc cleanup)

Scattered planning docs were consolidated into this file and archived under `docs/archive/`:

- `PLAN.md` → `docs/archive/PLAN-2026-05.md` (superseded — most of its "to build" is built).
- `docs/research-and-handoff-2026-06.md` → `docs/archive/` (historical handoff snapshot).

Live reference docs (unchanged, still authoritative): `PRODUCT.md`, `CLAUDE.md`,
`docs/{database,scraper,design-system,screens-and-testing}.md`, `memory/MEMORY.md`.
