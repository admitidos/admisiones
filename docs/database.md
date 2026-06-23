# Database reference

> Read when working on `packages/db/` (schema, seed) or any `features/*` data function.

## Shared spine

`University` → `Process` → `Program` — common to all universities. Powers listing,
calendar, and program catalogue.

`University` fields: `id`, `name`, `acronym` (unique — doubles as URL slug lowercased),
`color`, `status` (`"active" | "coming_soon"`).

Current universities: **UNMSM** (active), **UNI** (coming_soon), **UNICA** (coming_soon).
Near-term launch goal is UNMSM + UNI with real data (see `PRODUCT.md` §14).

## Per-university result tables

Result structures differ too much to share a table. Each university gets its own:

- `unmsm_results`, `unmsm_applicants`
- `uni_results`, `uni_applicants`

**No JSON columns** — all data must be queryable for analytics. UNI session scores go in
a `ResultScore` table (one row per session per result), not a JSON blob.

## Process-level rule flags on `Process`

Rules vary per process, not per university. Flags: `hasMinScoreFilter`,
`minScoreThreshold`, `sessionCount`, `hasAreas`, `hasModalities`.

## Prisma setup

- Config: `packages/db/prisma.config.ts` (`DATABASE_URL` lives here, not in `schema.prisma`)
- Generated client: `packages/db/generated/` — gitignored, rebuilt via the `prepare`
  script on install
- Seed: `packages/db/prisma/seed.ts`, uses `upsert` on `acronym` — safe to re-run

## Key business rules (data layer)

- **Admitted detection:** UNMSM — rank not null AND observation = "ALCANZO VACANTE".
  UNI uses its own status field.
- **Status values:** `"admitted" | "not_admitted" | "absent" | "disqualified"` —
  never collapse `absent` into `not_admitted`.
- **Cutoff (corte):** minimum score among all admitted per program per process.
  Calculated at seed time.
- **Campus (sede):** treated as separate programs in DB. Always show program + campus
  together.
- **UNMSM modalities:** applicant must know modality before lookup. Each modality has
  its own admitted list and its own cutoff.

## Architecture rule (enforced everywhere)

Pages → features → DB. **Pages never call the DB directly.** Business logic (percentiles,
reachable programs, cutoff tendency) lives in `features/`, never in components.

```
app/[university]/[process]/applicant/[code]/page.tsx
  → features/result/getResultData.ts
    → packages/db
```
</content>
