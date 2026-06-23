# admitidos.pe — Implementation Plan

> Last updated: 2026-05-09. Covers Phase 1 to production-ready.
> Phase 2 (university hub, global search, stats dashboard) and Phase 3 (simulator) are out of scope here.

---

## Table of contents

1. [Current state](#1-current-state)
2. [Design references](#2-design-references)
3. [Architecture rules](#3-architecture-rules)
4. [What needs to be built](#4-what-needs-to-be-built)
5. [Data layer — repositories & services](#5-data-layer--repositories--services)
6. [DB seed additions](#6-db-seed-additions)
7. [Feature functions (server-side)](#7-feature-functions-server-side)
8. [Pages & routes](#8-pages--routes)
9. [Components to build](#9-components-to-build)
10. [Cleanup & refactors](#10-cleanup--refactors)
11. [CI/CD](#11-cicd)
12. [Tests](#12-tests)
13. [Open questions](#13-open-questions)

---

## 1. Current state

### Done ✓
| Area | What exists |
|---|---|
| DB schema | Full Prisma schema, migrations applied, UNMSM seeded (2024-I → 2026-I) |
| Scraper | UNMSM CSV extraction + DB loader — idempotent, modular |
| Layout | Navbar, Footer, root layout |
| Home — HeroSection | "Último examen publicado" floating card with stats grid and gradient CTA |
| Home — PastExamsSection | Filterable (Todos/UNMSM/UNI) list of past processes |
| Home — UniversitiesGrid | 2-column grid, SVG logos (UNMSM/UNI/fallback), grayscale→color hover, coming-soon dimming |
| Proximos exámenes — CalendarClient | Timeline layout, university filter chips (with per-uni colors), session breakdown, countdown, empty state, no-data cards |
| Design system | CSS custom properties, Tailwind v4 theme, Fraunces + Plus Jakarta Sans, indigo primary |
| Storybook | Framework configured, 2 stories (Navbar, StatusBadge) |
| API | `GET /api/universities` — real DB query |

### Still on mock data ✗
| Feature | Gap |
|---|---|
| `getHomeData` | Returns hardcoded MOCK — must query DB |
| `getCalendarData` | Returns hardcoded MOCK — must query `ExamDate` |

### Not yet built ✗
| Area | Gap |
|---|---|
| **Result page** | `getResultData.ts` is empty stub — no route, no components, no repository |
| **Process page** | `getProcessData.ts` is empty stub — no route, no components, no repository |
| Computed fields | Percentile, cutoff distance, area rank, reachable programs — not implemented |
| `formatters.ts` | Empty stub |
| `seo.ts` | Empty stub — no `generateMetadata` implementations |
| Test suite | No Vitest, no Playwright, no test config |
| CI/CD | No `.github/` directory |

### Dead code to remove ✗
| File | Reason |
|---|---|
| `components/home/RecentProcesses.tsx` | Superseded by `PastExamsSection` — not used in page.tsx |
| `HomeData.processes` field in `getHomeData.ts` | Consumed by `RecentProcesses`, which is unused — remove the field too |
| `apps/web/Plan.md` | Stale home-page implementation plan, now done — delete |

---

## 2. Design references

All reference files live in `apps/web/design-reference/` (gitignored). Read these before building any screen.

| File | What it covers | Version |
|---|---|---|
| `admitidos v2.html` | Full app prototype — home, result, process pages | v2 |
| `admitidos-v3.html` | Revised home page with hero card, past exams list, university grid | v3 |
| `admitidos-v3-proximos-examenes.html` | Revised proximos-examenes — timeline, rich chips, sessions | v3 |
| `Paletas y Tipografía.html` | Color palette and type scale reference | v1 |
| `design-canvas.jsx` | React design canvas component | — |

**v3 vs current implementation — delta summary:**

The home page and proximos-examenes components already implement the v3 design almost exactly. The only functional deltas from v3 that we are _not_ adopting:

| v3 feature | Decision |
|---|---|
| Green (`#15803d`) as primary accent (nav, CTA) | **Not adopting** — keep indigo (`#4338ca`) as CLAUDE.md specifies |
| Warm off-white background `#f3f4f1` | **Not adopting** — keep `#ffffff` |
| "Exámenes pasados" as 3rd nav link | **Not adopting** — the section exists on home, nav stays at 2 links |

---

## 3. Architecture rules

The layered call chain is strictly enforced:

```
page.tsx (server component)
  └─ features/*/getData.ts        ← business logic + shape for UI
       └─ repositories/*.ts       ← Prisma queries, one file per domain entity
            └─ @admitidos/db      ← Prisma client

app/api/*/route.ts (API route)
  └─ services/*.ts                ← thin service wrapper
       └─ repositories/*.ts
```

- Pages **never** call Prisma directly.
- Feature functions call repositories, not services.
- Business logic (percentiles, cutoff math, reachable programs) lives in `features/`, not in components.
- Components receive shaped data — they never know about DB types.

---

## 4. What needs to be built

Priority order reflects the core user flow: **enter code → see result**.

| Priority | Item | Effort |
|---|---|---|
| 1 | Result page — repository + feature + route + components | High |
| 2 | Process page — repository + feature + route + components | Medium |
| 3 | Wire `getHomeData` to DB | Low |
| 4 | Wire `getCalendarData` to DB | Low |
| 5 | DB seed: add UNFV university | Low |
| 6 | DB seed: add UNMSM 2026-I ExamDate rows with note | Low |
| 7 | `formatters.ts` implementations | Low |
| 8 | `seo.ts` — `generateMetadata` for each page | Low |
| 9 | Dead code cleanup | Low |
| 10 | Test setup (Vitest + Playwright) + initial tests | Medium |
| 11 | CI/CD (GitHub Actions) | Low |
| 12 | Storybook stories for result components | Medium |

---

## 5. Data layer — repositories & services

All files go in `apps/web/src/repositories/`.

### Repositories to create

#### `process.repository.ts`
```
getProcessBySlug(universityAcronym, processSlug) → Process & { university, unmsmProcess }
listProcessesByUniversity(universityId) → Process[]
getRecentProcesses(take) → (Process & { university })[]
```

#### `program.repository.ts`
```
listProgramsByProcess(processId) → (Program & { career })[]
getProgramById(id) → Program & { career }
getHistoricalCutoffs(careerId, limit) → { period, cutoffScore, admissionRate }[]
```

#### `unmsm.applicant.repository.ts`
```
findUnmsmApplicantByCode(processId, code) → UnmsmApplicant & { result, program, modality }
listApplicantsByProgram(programId) → UnmsmApplicant & { result }[]
getScoreDistribution(programId) → { score: number }[]
```

#### `career.repository.ts`
```
listCareersByUniversity(universityId, area?) → Career[]
```

#### `examDate.repository.ts`
```
getUpcomingExamDates(fromDate) → (ExamDate & { process: { university } })[]
```

---

## 6. DB seed additions

### 6a. UNFV university

Add to `packages/db/prisma/seed.ts` (upsert on `acronym`):

```ts
{
  name: "Universidad Nacional Federico Villarreal",
  acronym: "UNFV",
  color: "#7c3aed",
  status: "coming_soon",
}
```

UNSAAC is already in seed via `UNSAAC` acronym — verify it's there or add similarly with `color: "#0f766e"`.

### 6b. ExamDate rows for UNMSM 2026-I

The `getCalendarData` mock has exact data to seed. The `ExamDate.note` field carries the formatted string `"Jornada N · HH:MM am · Descripción"`. This avoids a schema migration while keeping the data queryable for display.

Rows to add (linked to UNMSM 2026-I process):

| date | examType | note |
|---|---|---|
| 2026-03-07 | general | Jornada 1 · 10:00 am · Áreas D (Económicas) y E (Humanidades) |
| 2026-03-08 | general | Jornada 2 · 10:00 am · Áreas B (Ciencias Básicas), C (Ingenierías) y Especial |
| 2026-03-14 | general | Jornada 3 · 10:00 am · Área A — Salud (excepto Medicina Humana) |
| 2026-03-15 | general | Jornada 4 · 10:00 am · Área A — Medicina Humana (fecha exclusiva) |

UNI 2026-II dates are approximate (~Aug 17–21) — add with `note` prefixed `~` to indicate estimate.

---

## 7. Feature functions (server-side)

### `features/result/getResultData.ts` — the main feature

Input: `{ universityAcronym: string, processSlug: string, applicantCode: string }`

Steps:
1. Resolve university by `acronym`
2. Resolve process by `(universityId, slug)`
3. Validate code format: `if (!/^\d{6}$/.test(code)) return null`
4. Find applicant by `(processId, code)` → includes `result`, `program`, `modality`
5. Return `null` if not found (page renders 404)
6. Compute derived fields:

| Field | Formula |
|---|---|
| `pointsToAdmission` | `result.score − program.cutoffScore` (negative = below cutoff) |
| `percentileInProgram` | `count(scores < result.score) / count(total) × 100` |
| `rankInArea` | rank of `result.rank` among admitted across all programs in the same area |
| `reachablePrograms` | Same process + same area where `cutoffScore ≤ result.score`, ordered by cutoff desc |
| `historicalCutoffs` | `getHistoricalCutoffs(careerId, 4)` — last 4 processes |
| `cutoffTendency` | slope of the last 4 cutoff scores: `"rising" | "falling" | "stable"` |

Output shape:
```ts
interface ResultData {
  applicant: { code: string; fullName: string }
  result: { score: number; rank: number | null; status: ApplicantStatus; observation: string }
  program: { name: string; area: string | null; campus: string }
  modality: { code: string; name: string }
  process: { period: string; slug: string }
  university: { acronym: string; name: string; color: string }
  computed: {
    pointsToAdmission: number
    percentileInProgram: number
    cutoffScore: number | null
    totalApplicants: number
    totalAdmitted: number
    admissionRate: number | null
    reachablePrograms: ReachableProgram[]
    historicalCutoffs: HistoricalCutoff[]
    cutoffTendency: "rising" | "falling" | "stable"
    scoreDistribution: number[]
  }
}
```

### `features/process/getProcessData.ts`

Input: `{ universityAcronym: string, processSlug: string }`

Steps:
1. Resolve university + process
2. Query all programs for this process, including career (name, area)
3. Group by area (`A | B | C | D | E | null`)
4. Each program includes: `cutoffScore`, `totalApplicants`, `totalAdmitted`, `admissionRate`, `vacancies`

### `features/home/getHomeData.ts` — wire to DB

Replace MOCK with:
1. Most recent published process → `featuredProcess`
2. All processes ordered by year desc, semester desc → `pastProcesses`
3. All universities ordered by name → `universities` with `examCount`

Remove the unused `processes` field from `HomeData`.

### `features/calendar/getCalendarData.ts` — wire to DB

Replace MOCK with:
1. `examDate.repository.getUpcomingExamDates(today)` — grouped by process
2. Map `ExamDate.note` to parse `"Jornada N · time · description"` into `CalendarSession`
3. `noDataCards` for universities with `status = "coming_soon"` and no upcoming exam dates
4. Countdown computed from `date - today`

---

## 8. Pages & routes

### Directory structure to create

```
apps/web/src/app/
  [university]/
    [process]/
      page.tsx                   ← Process page (program list)
      not-found.tsx              ← "Proceso no encontrado"
      applicant/
        [code]/
          page.tsx               ← Result page (individual)
          not-found.tsx          ← "Código no encontrado"
```

### `app/[university]/[process]/page.tsx`

- Server component, async
- Calls `getProcessData({ universityAcronym: params.university.toUpperCase(), processSlug: params.process })`
- Renders `ProcessHeader`, `AreaFilter`, `ProgramTable`
- `generateMetadata`: `"UNMSM 2026-I — Resultados por carrera | admitidos.pe"`
- If process not found → `notFound()`
- Code lookup: input on this page (HTML form, `method="GET"`) → navigates to result URL

### `app/[university]/[process]/applicant/[code]/page.tsx`

- Server component, async
- Guard: `if (!/^\d{6}$/.test(params.code)) notFound()`
- Calls `getResultData(...)` — if null → `notFound()`
- Renders differently for admitted vs not-admitted (same components, different props)
- `generateMetadata`: `"[Nombre] — [Score] — [Programa] | admitidos.pe"`

---

## 9. Components to build

### Result page components

#### `result/ScoreHero.tsx`
- Score in Fraunces 64px
- Status badge (admitted = green, not_admitted = amber, absent/disqualified = gray)
- Program + modality + campus line
- `pointsToAdmission` pill: green if `>= 0`, amber if `< 0`
- Storybook: 4 states (admitted, not_admitted, absent, disqualified)

#### `result/PositionBar.tsx`
- Horizontal bar showing score among all applicants
- Markers: applicant score, cutoff score, program min/max
- Input: `{ score, cutoffScore, minScore, maxScore, percentile }` (no raw array)
- Storybook: above cutoff, just below, far below

#### `result/CutoffHistoryChart.tsx`
- SVG line chart of cutoff across last N processes
- Dashed average line; applicant score overlaid on latest
- Storybook: rising trend, falling trend, 4 processes of data

#### `result/AltProgramRow.tsx`
- Program name, cutoff score, points diff pill (green / amber)
- Storybook: would-admit, would-not-admit, cross-area

#### `result/ReachableProgramsList.tsx`
- List of `AltProgramRow`; cross-area amber warning badge if mixing areas
- Heading: "¿Habrías ingresado en estas carreras?"

#### `result/ScoreDistributionBar.tsx` ← `"use client"`
- Interactive distribution of all scores; hover tooltip; applicant marker
- Storybook: gaussian, bimodal

### Process page components

#### `process/ProcessHeader.tsx`
- Process title, stats grid (applicants, vacancies, programs, rate)
- Modality chips

#### `process/AreaFilter.tsx` ← `"use client"`
- A/B/C/D/E filter chips, "Todas" default
- Persists in URL as `?area=A`

#### `process/ProgramTable.tsx`
- Sortable table: program, campus, vacancies, cutoff, applicants, rate
- `AreaChip` per row; links to result lookup

### Shared UI components

#### `ui/AreaChip.tsx` — areas A–E + null
#### `ui/StatTile.tsx` — number + label + optional sublabel
#### `ui/Breadcrumb.tsx` — `{ label, href? }[]`
#### `ui/ModalidadBadge.tsx` — modality code + short name

---

## 10. Cleanup & refactors

| Action | File |
|---|---|
| Delete | `apps/web/src/components/home/RecentProcesses.tsx` |
| Remove unused field | `HomeData.processes` from `getHomeData.ts` |
| Delete | `apps/web/Plan.md` |
| Implement | `apps/web/src/lib/utils/formatters.ts` |
| Implement | `apps/web/src/lib/utils/seo.ts` |
| Add `date-fns` | For countdown + date formatting in calendar and process pages |

### `formatters.ts`
```ts
formatScore(n: number): string         // 1255 → "1,255.00" (Peruvian locale)
formatPercentile(n: number): string    // 0.62 → "top 62%"
formatRate(n: number): string          // 0.097 → "9.7%"
formatPoints(n: number): string        // -47 → "−47 pts", 12 → "+12 pts"
formatTendency(deltas: number[]): "rising" | "falling" | "stable"
```

---

## 11. CI/CD

GitHub Actions `.github/workflows/ci.yml` — triggers on PR and push to main:

| Job | Command |
|---|---|
| `type-check` | `pnpm -r tsc --noEmit` |
| `lint` | `pnpm -r lint` |
| `unit-tests` | `pnpm -r test --run` (Vitest) |
| `build` | `pnpm build` (push to main only) |

Playwright E2E runs separately — nightly or on merge to main.

---

## 12. Tests

### Unit tests — `lib/utils/`
- `formatScore(1255)` → `"1,255"`
- `formatPercentile(0.38)` → `"top 62%"`
- `formatPoints(-47)` → `"−47 pts"`
- `formatTendency([1200, 1230, 1260])` → `"rising"`

### Unit tests — `features/result/`
- Percentile at median → 50th percentile
- `cutoffTendency` — rising, falling, flat, noisy
- `reachablePrograms` — same-area filter, score threshold
- Cross-area flag → `crossAreaWarning: true`

### Integration tests — repositories
- `findUnmsmApplicantByCode` — known seeded code returns correct result
- `getHistoricalCutoffs` — 4 records in chronological order
- `listProgramsByProcess` — all programs have `cutoffScore` populated

### Storybook
| Component | Stories |
|---|---|
| `ScoreHero` | admitted, not_admitted, absent, disqualified |
| `PositionBar` | above cutoff, just below, far below, no cutoff data |
| `CutoffHistoryChart` | 4 rising, 4 falling, missing data |
| `AltProgramRow` | would-admit, would-not-admit, cross-area |
| `AreaChip` | A, B, C, D, E, null |

### Playwright E2E
| Test | Assert |
|---|---|
| Result page — admitted | Score visible, status badge = "Admitido" |
| Result page — not admitted | Amber score, "no admitido" badge, deficit visible |
| Result not found | `not-found.tsx` renders |
| Process page | Program list renders, area filter works |
| Home | Hero renders, universities grid renders |
| Calendar | At least one exam card renders |

---

## 13. Open questions

**Q1 — Percentile scope:** For Medicina Humana applicant — program-level or area-level?
Both are shown per CLAUDE.md (`rank in program` + `rank in area`). Confirm the area-level rank crosses modalities (all Área A applicants regardless of modality) or is scoped per modality.

**Q2 — Share button behavior:** CLAUDE.md says "always show share button." Preferred implementation:
- (a) Copy URL to clipboard
- (b) Web Share API with clipboard fallback
- (c) Social links (WhatsApp, Twitter)

**Q3 — Score distribution data strategy:** All applicant scores for a program (~200–500 rows) are needed for `PositionBar` and the distribution chart. Fetch server-side at page load (simpler, slightly higher TTFB) or lazy-load client-side?

**Q4 — Process page: program list only, or also individual applicant list?** CLAUDE.md defines both `/[uni]/[process]` (aggregate stats) and `/[uni]/[process]/[program]` (applicant list). Phase 1 implements only the aggregate table. Confirm applicant list is Phase 2.
