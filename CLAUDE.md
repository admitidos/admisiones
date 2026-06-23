# admitidos.pe — operational guide for Claude Code

This is the **HOW** — the operational contract for working in this repo. It stays lean
on purpose (it loads into context every turn). The **WHY** lives in `PRODUCT.md`; deep
technical reference lives in `docs/*.md`, read on demand.

| Need | Read |
|---|---|
| **What to do next + in what order (ship-first)** | `ROADMAP.md` |
| Product vision, personas, emotional rules, screen specs, decisions log | `PRODUCT.md` |
| Scraper / portal details | `docs/scraper.md` |
| DB schema, business rules, Prisma setup | `docs/database.md` |
| Design tokens, colors, fonts, prototypes | `docs/design-system.md` |
| Screen list, Storybook candidates, test IDs | `docs/screens-and-testing.md` |
| Evolving decisions + real-user feedback | `memory/MEMORY.md` |

## What this is

admitidos.pe contextualizes university admission results from Peruvian public
universities (starting UNMSM). Not an official portal — a UX + interpretation layer.
Core value: not just *whether* you got in, but *what it means*.

## Prime directive — product before code

**The riskiest assumption is not "can we get the data" (solved). It is "does the
contextualized result actually change how an applicant/parent feels and decides."**
That is answered by shipping to real users and watching — not by more code.

So, in order:
1. **Ship thin + instrument.** Get the result/home/process pages live behind a real URL
   with analytics, then iterate from real result-day traffic and feedback.
2. **The scraper is a batch job run 2–3×/year.** Make it correct, not elegant. Do not
   over-invest engineering there.
3. **Validate before polishing.** Before gold-plating a screen, confirm the question it
   answers is real (cheap user research beats guessing — see `PRODUCT.md` §16–17).

When a task would add code that doesn't move toward "live, instrumented, in front of
real users," pause and say so. Prefer the smallest shippable version.

**Strategic lenses available as subagents** (`.claude/agents/`) — invoke when a decision
needs a perspective, not just code: `product-strategist` (YC lens: riskiest assumption,
smallest test, what to cut), `design-critic` (emotional + UX rules), `architect`
(ship-ability over elegance).

## Language rules

- Code identifiers: English. User-facing copy: Spanish.
- Raw portal values (e.g. "ALCANZO VACANTE"): keep as-is.

## Naming: Proceso (code) vs Examen (UI) — never mix

User-facing copy always says **"Examen"** (the 17–22 yr old thinks "el examen de San
Marcos"). Code and DB always say **"Proceso"** (a Proceso contains multiple **Jornadas**
— individual exam dates; "Examen" would make a Jornada "an exam within an exam").
Translation happens at the presentation layer only.

| Layer | Rule | Example |
|---|---|---|
| Navbar link / page titles / copy | "Examen", "Exámenes" | not "Procesos" |
| URLs | neutral | `/unmsm/2026-1` |
| Prisma model / functions / folders | `Proceso`, `getProcesoData`, `proceso/` | unchanged |

## Monorepo & stack

```
admitidos-pe/
├── apps/web/        ← Next.js 16 App Router (TypeScript, Tailwind v4)
├── apps/scraper/    ← standalone Node.js + tsx pipeline (runs outside Next.js)
└── packages/db/     ← @admitidos/db — Prisma 7 schema, client, seed
```

- **DB:** PostgreSQL (local + prod — no SQLite). Prisma 7, connection in `prisma.config.ts`.
- **Package manager:** pnpm workspaces. **Deploy:** Vercel.
- **URL pattern:** `/[university]/[process]/applicant/[code]` — `[university]` = acronym lowercased.
- Before writing Next.js code, read `node_modules/next/dist/docs/`.

## Architecture rule

**Pages → features → DB. Pages never touch the DB directly.** Business logic
(percentiles, reachable programs, cutoff tendency) lives in `features/`, never in
components. Full data rules in `docs/database.md`.

## Design essentials

Theme: **Degradado índigo**. `font-serif` = Fraunces (headlines/scores), `font-sans` =
Plus Jakarta Sans (UI/body). Accent `#4338ca`. Hero `var(--hero-bg)`. Full tokens in
`docs/design-system.md`. **Emotional rules are non-negotiable:**

- **NEVER red** for results — amber/copper = "close, keep going".
- Green only for genuine achievement (admitted, reachable programs).
- Informational text is neutral black/gray; accents are for actions/badges only.
- "No ingresó" must always end with a path forward. Share button in BOTH states.
- Result header always shows **modalidad · carrera · sede**.
- Never collapse `absent` into `not_admitted` (4 statuses are distinct).
- Comparing scores across áreas requires an amber warning badge.

## Code style

- **TypeScript** strict, no `any`. Prefer `const`; `let` only inside `for` loops.
- **Remeda** for array/object transforms (`pipe`, `map`, `filter`, `groupBy`, `sortBy`)
  — no imperative loops for data transforms. Never mutate; return new values.
- Components under ~150 lines — extract sub-components/hooks beyond that.
- Comment only when the WHY is non-obvious (constraint, invariant, workaround).
- **Tailwind v4:** `@theme inline` for tokens (not `extend`); utilities over inline
  styles (inline only for JS-dynamic values); mobile-first (`sm:`/`md:`/`lg:`).

## Testing & Storybook

- **Playwright** E2E in `apps/web/e2e/`. Use `data-testid` (NOT `data-cy`).
- Stateful components **must** have a `.stories.tsx` beside them, named after the
  user-visible state (`Admitted`, `NotAdmitted`, …).
- Full test-ID list, Storybook candidates, and the design→component→test loop:
  `docs/screens-and-testing.md`.

## What NOT to do

- Call DB from page components.
- Use **red** for non-admitted results.
- Add a search bar to the navbar; show "Estadísticas" as top-level nav in MVP.
- Treat `absent` = `not_admitted`.
- Compare scores across áreas without an amber warning.
- Omit modalidad + carrera + sede from the result header.
- Use JSON columns for data that needs querying/aggregation.
- Use `data-cy`; use `let` outside `for`; write imperative loops for data transforms.
- Over-invest in scraper code at the expense of shipping the product.
</content>
