# admitidos.pe — Project Context for Claude Code

## What this is

admitidos.pe aggregates and contextualizes university admission results from Peruvian public universities. It is not an official portal — it is a UX layer on top of raw data that official portals publish without context.

Core value: not just whether you got in, but what it means. Score 1,255 in UNMSM Medicina → top 62% of applicants, 47 points short of cutoff, would have gotten into Farmacia and Enfermería.

Main competitor: Ciclero.guru — aggregated stats per program but no individual result lookup.

## Language rules

- Code identifiers: English
- User-facing copy: Spanish
- Raw portal values (e.g. "ALCANZO VACANTE"): keep as-is

## Monorepo structure

```
admitidos-pe/
├── apps/
│   ├── web/          ← Next.js 15 App Router
│   └── scraper/      ← standalone Node.js data pipeline
└── packages/
    └── db/           ← @admitidos/db — Prisma schema, client, seed
```

URL pattern: `/[university]/[process]/applicant/[code]`
`[university]` segment = acronym lowercased (e.g. `/unmsm/`, `/uni/`)

## Tech stack

- Framework: Next.js 16 (App Router), TypeScript — read `node_modules/next/dist/docs/` before writing Next.js code
- Styling: Tailwind CSS
- ORM: Prisma 7 — connection config in `prisma.config.ts`, not in `schema.prisma`
- DB: PostgreSQL (local and production — no SQLite)
- Package manager: pnpm workspaces
- Deployment: Vercel
- Scraper: Node.js + tsx, runs outside Next.js

## Database architecture

### Shared spine

`University` → `Process` → `Program` — common to all universities. Powers listing, calendar, and program catalogue.

`University` fields: `id`, `name`, `acronym` (unique — doubles as URL slug lowercased), `color`, `status` (`"active" | "coming_soon"`)

Current universities: UNMSM (active), UNI (coming_soon), UNICA (coming_soon)

### Per-university result tables

Result structures differ too much to share a table. Each university gets its own:

- `unmsm_results`, `unmsm_applicants`
- `uni_results`, `uni_applicants`

No JSON columns — all data must be queryable for analytics. UNI session scores go in a `ResultScore` table (one row per session per result), not a JSON blob.

### Process-level rule flags on `Process`

Rules vary per process, not per university. Flags: `hasMinScoreFilter`, `minScoreThreshold`, `sessionCount`, `hasAreas`, `hasModalities`.

### Prisma setup

- Config: `packages/db/prisma.config.ts` (DATABASE_URL lives here)
- Generated client: `packages/db/generated/` — gitignored, rebuilt via `prepare` script on install
- Seed: `packages/db/prisma/seed.ts`, uses upsert on `acronym` — safe to re-run

## Scraping pipeline

```
Extractor → JSON files (apps/scraper/data/, gitignored) → seed → DB
```

Each university has its own extractor. Intermediate JSONs are gitignored; `.gitkeep` tracks the folder.

### UNMSM

- Portal: `admision.unmsm.edu.pe/Website[YEAR][PERIOD][TYPE]/`
- Sub-portals per process: General, Especial, Cobertura, Por Resolución
- Columns: CODIGO | APELLIDOS Y NOMBRES | ESCUELA PROFESIONAL | PUNTAJE | MERITO | OBSERVACIÓN
- Admitted: MERITO has a number AND OBSERVACIÓN = "ALCANZO VACANTE"
- Area from URL path (`/A/` → Área A), campus from program name suffix (`— Sede X`)
- No DNI published

### UNI

- Portal: `puntajes.admision.uni.edu.pe/admision/resultados-finales/`
- 3 sessions (DIAD): Mon (Razonamiento + Humanidades), Wed (Matemática), Fri (Ciencias)
- Final score is cumulative; session scores go in `ResultScore` table
- Results available ~60 days post-publication — scrape immediately
- No area system

### UNSA / UNSAAC (Phase 2)

- UNSA: Arequipa, ~49,500 applicants/year, 3 areas (Biomédicas, Ingenierías, Sociales)
- UNSAAC: Cusco, portal TBD

## Layered architecture

Pages → features → DB. Never call DB directly from pages.

```
app/[university]/[process]/applicant/[code]/page.tsx
  → features/result/getResultData.ts
    → packages/db
```

Business logic (percentiles, reachable programs, cutoff tendency) lives in `features/`, never in components.

## Design system

**Theme**: Degradado índigo — `linear-gradient(145deg, #1e1b4b → #0f766e)` for the hero.

**Fonts** (self-hosted via `next/font/google`, zero external requests):
- `font-serif` → Fraunces — headlines, scores, logo
- `font-sans` → Plus Jakarta Sans — UI, body

**Implementation**: `apps/web/src/app/globals.css` (`:root` CSS vars + Tailwind v4 `@theme inline`) and `apps/web/src/app/layout.tsx` (font loading, `lang="es"`, SEO metadata).

**Tailwind color utilities** (all registered via `@theme inline`):

| Utility | CSS var | Value | Use |
|---|---|---|---|
| `bg-background` / `text-foreground` | `--background` / `--foreground` | `#ffffff` / `#1a1a1a` | Page base |
| `text-muted` | `--muted` | `#6b7280` | Secondary text |
| `bg-border` / `border-border` | `--border` | `#e8eaed` | Dividers, card borders |
| `bg-accent` / `text-accent` | `--accent` | `#4338ca` | Primary CTA, active nav |
| `bg-accent-dark` | `--accent-dark` | `#1e1b4b` | Hover, pressed states |
| `bg-green-600` | `--g600` | `#1c6b3a` | UNMSM brand, admitted badge bg |
| `bg-green-500` | `--g500` | `#238a4a` | Admitted text on light |
| `bg-green-50` | `--g50` | `#eef7f1` | Admitted card background |
| `bg-amber-600` / `text-amber-600` | `--a600` | `#a86b1a` | Non-admitted score, warnings |
| `bg-amber-50` | `--a50` | `#faf4e8` | Non-admitted card background |

**Hero gradient** — CSS-var only, not a Tailwind color (gradients can't be colors):
```css
background: var(--hero-bg); /* linear-gradient(145deg, #1e1b4b 0%, #0f766e 100%) */
```
Use `bg-[var(--hero-bg)]` in Tailwind or inline style for hero sections.

**Border radius** (overrides Tailwind defaults):
- `rounded-sm` → 8px — buttons, badges, small cards
- `rounded` → 12px — standard cards
- `rounded-lg` → 16px — large cards, modals

**Shadows** — CSS-var only (use inline style or `shadow-[var(--shadow)]`):
- `--shadow` — `0 1px 3px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.06)`
- `--shadow-lg` — `0 8px 32px rgba(0,0,0,.12)`

**Design reference files**: `apps/web/design-reference/` (gitignored). Contains the HTML prototypes from Claude Design — read before building any new screen.

## Component and screen plan

### Phase 1 screens

| Screen | Route | Key data source |
|---|---|---|
| Home | `/` | `getHomeData` — process list + university grid |
| Process (career table) | `/[uni]/[process]` | `getProcessData` — careers grouped by área |
| Career applicant list | `/[uni]/[process]/[program]` | program applicants, filterable |
| Result individual | `/[uni]/[process]/applicant/[code]` | `getResultData` |
| Upcoming exams | `/examenes` | `getCalendarData` |
| 404 | `not-found.tsx` | — |

### Storybook candidates

These have meaningful state variations or complex visual logic that warrants isolation:

| Component | Why storybook |
|---|---|
| `ScoreHero` | admitted vs. not-admitted; gradient bg; Fraunces score at 64px |
| `PositionBar` | score marker, cutoff marker, area min/max markers, color zones |
| `DistributionChart` | interactive SVG: hover tooltip, drag-to-select range, gaussian curve |
| `CutoffHistoryChart` | 4-process trend; average dashed line; admitted/missed annotations |
| `AltProgramRow` | "¿Habrías ingresado?" row — advantage/deficit pill, green vs. amber |
| `StatusBadge` | 4 states: `admitted` / `not_admitted` / `absent` / `disqualified` |

Everything else (Navbar, Footer, AreaChip, ModalidadBadge, StatTile, Breadcrumb) is stateless enough to test in context.

## Key business rules

- **Admitted detection**: UNMSM — rank not null AND observation = "ALCANZO VACANTE". UNI uses its own status field.
- **Status values**: `"admitted" | "not_admitted" | "absent" | "disqualified"` — never collapse absent into not_admitted.
- **Cutoff**: minimum score among all admitted per program per process. Calculated at seed time.
- **Cross-area comparison**: show amber warning badge when comparing scores across different areas.
- **Campus**: treated as separate programs in DB. Always show program + campus together.
- **UNMSM modalities**: applicant must know modality before lookup. Each has its own admitted list and cutoff.

## Result page

**Admitted**: score (hero, Fraunces) · rank in program · rank in area · points above cutoff (green) · position bar · cutoff tendency · admission rate · historical chart (4 processes) · reachable programs (chips) · "Tu carrera" section

**Non-admitted**: score · points below cutoff (amber, never red) · proximity % · percentile · status badge · position bar · historical chart with average line · "habrías ingresado en X de 4 procesos" · programs they'd have gotten into · "Cuánto te faltó" bars

**Emotional rules**: NEVER red for admission results — amber = "close, keep going". Always show share button in both states.

## Navbar / Footer

Navbar: `[logo] | Procesos · Próximos exámenes | [CTA → most recent process]`
No search bar. No "Estadísticas" in MVP nav.

Footer: "Hecho con [coffee SVG] por Daniel Guzmán"

## Screens

**Phase 1**: Home · Individual result · Process (program list) · Upcoming exams · 404 · OG meta tags
**Phase 2**: University hub · Program detail · Global search · Stats dashboard
**Phase 3**: Pre-exam simulator · Multi-university home redesign

## What NOT to do

- Call DB from page components
- Use red for non-admitted results
- Add search bar to navbar
- Show "Estadísticas" as top-level nav in MVP
- Treat absent = not_admitted
- Compare scores across areas without an amber warning
- Omit modality + program + campus from the result page header
- Use JSON columns for data that needs to be queried or aggregated
