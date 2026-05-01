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

- Framework: Next.js 15, App Router, TypeScript
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

Fonts: Fraunces (headlines, numbers, logo) · Plus Jakarta Sans (UI, body)

| Token | Value |
|---|---|
| Primary green | #15803D |
| Background | #F3F4F1 |
| Surface | #FFFFFF |
| Text primary | #111827 |
| Text secondary | #6B7280 |
| Amber (non-admitted) | #D97706 |
| Amber dark | #92400E |
| Success / over cutoff | #16A34A |
| Cutoff marker | #D97706 |

Border radius: cards 18–20px · small cards 10–12px · buttons 10–14px · badges 100px

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
