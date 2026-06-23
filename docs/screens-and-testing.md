# Screens, components & testing reference

> The screen flow is considered FIXED (see `PRODUCT.md` §8). Visual design may change.
> Detailed per-screen spec lives in `PRODUCT.md` §8 — this file is the build checklist.

## Phase 1 screens (MVP — launch-ready)

| Screen | Route | Key data source |
|---|---|---|
| Home | `/` | `getHomeData` — process list + university grid |
| Process (career table) | `/[uni]/[process]` | `getProcessData` — careers grouped by área |
| Career applicant list | `/[uni]/[process]/[program]` | program applicants, filterable |
| Result individual | `/[uni]/[process]/applicant/[code]` | `getResultData` |
| Upcoming exams | `/proximos-examenes` (timeline) | `getCalendarData` |
| 404 empático | `not-found.tsx` | — |
| OG meta for result | `opengraph-image.tsx` | critical for WhatsApp sharing |

Phase 2: University hub · Career statistics (storytelling page) · Global search · Stats dashboard.
Phase 3: Pre-exam simulator · Multi-university home redesign.

## Result page contents (the most critical screen)

**Admitted:** score (hero, Fraunces) · rank in program · rank in area · points above
cutoff (green) · position bar · cutoff tendency · admission rate · historical chart
(4 processes) · reachable programs (chips) · "Tu carrera" section.

**Non-admitted:** score · points below cutoff (amber, never red) · proximity % ·
percentile · status badge · position bar · historical chart with average line ·
"habrías ingresado en X de 4 procesos" · programs they'd have gotten into · "Cuánto te faltó" bars.

Header must ALWAYS show **modalidad · carrera · sede** at name-level importance.

## Storybook candidates (stateful / complex visual logic → must have `.stories.tsx`)

| Component | Why |
|---|---|
| `ScoreHero` | admitted vs not-admitted; gradient bg; Fraunces score at 64px |
| `PositionBar` | score marker, cutoff marker, area min/max markers, color zones |
| `DistributionChart` | interactive SVG: hover tooltip, drag-to-select, gaussian curve |
| `CutoffHistoryChart` | 4-process trend; average dashed line; annotations |
| `AltProgramRow` | "¿Habrías ingresado?" — advantage/deficit pill, green vs amber |
| `StatusBadge` | 4 states: admitted / not_admitted / absent / disqualified |

Stateless enough to test in context (no story required): Navbar, Footer, AreaChip,
ModalidadBadge, StatTile, Breadcrumb.

Story naming: name after the user-visible state — `Admitted`, `NotAdmitted`, `Absent`,
`Disqualified`. Story file lives beside the component.

## E2E (Playwright)

- Use `data-testid="..."` on all interactive / key assertion targets (NOT `data-cy`).
- Tests live in `apps/web/e2e/`. Config: `apps/web/playwright.config.ts`.
- Cover: happy path, not-admitted path, empty states, 404s, key filter interactions.

Standard test IDs:
- `score-hero`, `applicant-status`, `points-to-admission`
- `position-bar`, `distribution-chart`, `cutoff-history-chart`
- `reachable-programs`, `share-button`
- `process-header`, `area-filter`, `area-filter-{A|B|C|D|E}`
- `program-row`, `applicant-row`, `applicant-search`
- `hero-section`, `universities-grid`, `calendar-timeline`
- `not-found`

## Design → component → test loop (the iteration workflow)

1. Review the relevant `design-reference/*.html` prototype (or build a fresh HTML/artifact).
2. Lock the screen layout visually before extracting code.
3. Extract components; keep each under ~150 lines.
4. Add `.stories.tsx` for any stateful component (see table above).
5. Add/extend the Playwright spec for the flow.
6. Deploy to preview, look at it on mobile, then merge.
</content>
