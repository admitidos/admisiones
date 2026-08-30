# University research playbook

> **Purpose.** A repeatable, agent-followable procedure for researching a Peruvian
> public university's admission process and turning it into a per-process research
> file that feeds the database. Generalized from how **UNMSM** was done. The next
> target is **UNICA** (Universidad Nacional San Luis Gonzaga de Ica) — a starter stub
> already exists at `apps/scraper/src/universities/unica/research/` (see step 6).
>
> Read this end-to-end before researching a new university. You should be able to
> produce a correct research file from this document alone, without further context.

## What a "research file" is (and is not)

A research file is a **hand-curated YAML** capturing the *rules* of one admission
process (one `process_id`, e.g. `2026-I`): how the exam is structured, whether there
is a minimum score, which modalities exist, exam dates, vacancies, and — critically —
**where each fact came from and how confident we are**.

It is NOT the scraped results data. Results come from the portal as CSV (the scraper's
job). The research file is the *interpretation layer*: it tells the loader/seed how to
flag the process and lets the product explain results correctly (cutoffs, áreas,
"close, keep going" framing). One YAML per process, living beside the university's
scraper code.

Reference examples (do **not** edit them):
`apps/scraper/src/universities/unmsm/research/2026-I.yaml`,
`.../2024-I.yaml`, `.../2024-II.yaml`, `.../2025-I.yaml`, `.../2025-II.yaml`.

Annotated blank template: `docs/templates/research.template.yaml`.

---

## Confidence notation (use it on every non-obvious fact)

Every flag/value that could be wrong gets an inline marker on the same line:

| Marker | Meaning | Use when |
|---|---|---|
| `[✓]` | **Official / authoritative** | Stated in the reglamento/prospecto PDF, or directly verified from the scraped CSV. Cite the article/anexo, e.g. `# [✓] Art. 29 del reglamento`. |
| `[~]` | **Corroborated, not primary** | Only from news (Infobae, El Comercio), academy blogs (Lumbreras, Ciclero), or inference. Treat as a lead to confirm, never as truth. |
| (none) | Structural/derived | Obvious bookkeeping (`area_count: 5` when 5 áreas are listed). |

Rules:
- Prefer `[✓]` from the **PDF** for rules; `[✓]` from the **CSV** for *what actually
  happened* (e.g. "min admitted score = 900.875 confirms the 900 filter").
- A news claim that contradicts (or isn't in) the official PDF stays `[~]` and gets a
  note. Example from UNMSM 2026-I: news reported the 900 min was reinstated; the
  reglamento only says "estricto orden de mérito", so we recorded
  `has_min_score_filter: false` with `confirmed: false` and a note. **Do not invent
  the qualifier the news implied.**
- When unknown, write `null` / `TODO` plus the exact source to check. Never guess
  vacancies, dates, or thresholds.

---

## Step 1 — Locate the official sources

For each university, find these (in priority order). Save URLs in the file header.

1. **Reglamento de Admisión** (PDF) — the authoritative rulebook. Source of: exam
   structure, scoring (points per correct/incorrect/blank), minimum-score rule,
   modalities, segunda opción rule, áreas, cronograma (exam dates). Cite by
   **article (Art. N)** and **anexo**.
2. **Prospecto de Admisión** (PDF) — often where the **cuadro de vacantes** (vacancies
   per program/campus) and detailed exam-content distribution live. Sometimes the
   reglamento and prospecto are one document.
3. **Results portal** — the public page listing admitted/non-admitted applicants. This
   is what the scraper reads. Record the root URL pattern and per-modality structure.
4. **Cuadro de vacantes** — vacancies per program × campus (sede). May be inside the
   prospecto or a standalone PDF/page.

Where to look: the university's official admission site (`admision.<univ>.edu.pe` or
the central site), its DICA/Oficina de Admisión section, and official PDF links. Use
web search to *find* documents, but **only the official PDF/portal counts as `[✓]`**.
For UNMSM the portal is `admision.unmsm.edu.pe/Website<YEAR><PERIOD>/`; other
universities differ — record the real pattern you find.

> The scraper is a batch job run 2–3×/year (see root `CLAUDE.md`). Get the sources
> *correct*; do not over-engineer.

---

## Step 2 — Extract the rule set, recording source + confidence

Work through the reglamento/prospecto and fill the template. Capture at least:

- **Áreas**: do programs split into subject áreas? How many, and their names? (UNMSM: 5
  — A Salud, B Ciencias Básicas, C Ingenierías, D Económicas, E Humanidades/CC.JJ.)
- **Modalities**: EBR/ordinaria only, or also special modalities (traslados,
  deportistas, etc.)? List the codes the portal publishes.
- **Minimum-score rule**: is there a stated `puntaje mínimo` (e.g. UNMSM's historical
  900)? Quote the article. Note whether it applies to all modalities or only the
  general exam (UNMSM 2024-II: enforced only for modality A).
- **Exam structure**: total questions, duration, sections + counts (habilidades /
  conocimientos / actitudinal …), and per-section breakdowns. If general vs. special
  exams differ, record both (`exam_general` / `exam_special`).
- **Scoring**: points for correct / incorrect / blank-or-multiple. Negative-marking
  details and any "no negative score" section.
- **Segunda opción**: can an applicant be admitted to a second-choice program? Record
  the rule and the observation values that appear in results.
- **Sessions**: does one applicant sit one exam (UNMSM: `session_count: 1`) or several
  scored cumulatively (UNI: 3 sessions → store per-session, never a JSON blob)?
- **Partial process**: is this only the first stage of the year (some modalities held
  for the next process)? UNMSM 2026-I covers only EBR/EBA + CEPUNMSM.
- **Jornadas (exam dates)**: each date, day, the áreas/modalities sitting that day, and
  notes (e.g. Medicina Humana on its own date).
- **Vacancies**: per program, per campus. Only record numbers you can cite.

After scraping (or from a prior CSV), **cross-check rules against reality** and record
it as `[✓]` CSV evidence: min admitted score vs. the stated threshold; presence/absence
of "SEGUNDA OPCIÓN" observations; which modality codes actually appear; row counts.

Keep cross-process history blocks (`min_score_history`, `segunda_opcion_history`) so a
later agent sees how a rule evolved — these caught the UNMSM 2026-I news discrepancy.

---

## Step 3 — Map each field to the Prisma model

The research YAML is the human-readable source; the **seed** (`packages/db/prisma/seed.ts`)
is where values are transcribed into the DB. Mapping (see `packages/db/prisma/schema.prisma`):

### University (`UNIVERSITIES` array in seed.ts → `universities` table)
| Research / known fact | Field | Notes |
|---|---|---|
| Full legal name | `name` | e.g. "Universidad Nacional San Luis Gonzaga" |
| Short name | `shortName` | e.g. "San Luis Gonzaga" |
| Acronym (UPPER) | `acronym` | **unique; lowercased = URL slug** (`/unica/...`) |
| City | `location` | e.g. "Ica" |
| Brand color | `color` | hex |
| `active` / `coming_soon` | `status` | set `active` only once real data lands |

UNICA already exists in seed.ts as `coming_soon` (acronym `UNICA`, Ica).

### Process (`Process` / `processes`)
| Research field | DB field |
|---|---|
| `process_id` (e.g. `2026-I`) → URL slug (`2026-1`) | `slug` (per-university unique) |
| `process_id` display form | `period` |
| exam year / semester | `examYear`, `examSemester` |
| reglamento PDF URL | `regulationUrl` |
| (computed at seed) | `totalApplicants`, `totalAdmitted`, `publishedAt` |

### Per-process rule flags — UNMSM uses `UnmsmProcess` (`unmsm_processes`)
These are the heart of the research file. Each university gets its **own** per-process
flags table when its rules need fields UNMSM's lacks (mirror this model).

| Research flag | `UnmsmProcess` field | Type |
|---|---|---|
| `is_partial_process` | `isPartialProcess` | Boolean |
| `has_areas` | `hasAreas` | Boolean |
| `has_min_score_filter` | `hasMinScoreFilter` | Boolean |
| `min_score_threshold` | `minScoreThreshold` | Int? (null if none) |
| `has_segunda_opcion` | `hasSecondChoice` | Boolean |

> `docs/database.md` lists the canonical flag set: `hasMinScoreFilter`,
> `minScoreThreshold`, `sessionCount`, `hasAreas`, `hasModalities`. `session_count` and
> `has_modalities`/`area_count` live in the research YAML even where the current UNMSM
> flags table doesn't store every one — keep them; they drive scraper behaviour and
> document the process. If a new university needs a flag UNMSM lacks (e.g.
> `sessionCount` for UNI's 3 jornadas), add it to *that university's* process-flags model.

### Exam dates (`jornadas` → `ExamDate` / `exam_dates`)
| Research | DB field |
|---|---|
| `date` | `date` |
| `areas` (encode in note if multiple) / single area | `area` |
| `exam_type` (`general` / `special`) | `examType` |
| free-text qualifier | `note` |

UNMSM seeds one `ExamDate` row per jornada with `area`/`note` (e.g. "Medicina Humana
únicamente").

### Modalities (`portal_modality_codes` → `UnmsmModality` + `UnmsmProcessModality`)
Modality master list is seeded once (`UNMSM_MODALITIES`); the join table records which
modalities a given process actually published. The loader derives the join from CSV
rows (`seedProcessModalities.ts`).

### Vacancies (`vacancies_*` → `Program.vacancies`)
Per program × campus. `Program` is `(processId, careerId, campus)` unique; sede is a
**separate** program entry. `cutoffScore` is computed at seed (min admitted score per
program), not stored in research.

---

## Step 4 — Understand the data-load path (research → DB)

```
Official PDF + portal                      (Step 1–2: human/agent research)
   │
   ├── research/*.yaml   (rules, flags, sources, confidence)  ← THIS PLAYBOOK
   │        │
   │        └─► transcribed by hand into packages/db/prisma/seed.ts
   │                (UNIVERSITIES, *_MODALITIES, *_PROCESSES → University,
   │                 Process, <Univ>Process flags, ExamDate)
   │
   └── portal results ──► scraper extractor ──► CSV (apps/scraper/data/, gitignored)
            apps/scraper/src/universities/<univ>/processes/<process>.ts
                                   │
                                   └─► loaders (apps/scraper/src/loaders/<univ>/)
                                          seedCareers → seedPrograms →
                                          seedProcessModalities → seedApplicants →
                                          seedResults → computeStats
```

Order of operations (must run in this sequence):
1. `packages/db/prisma/seed.ts` — creates universities, modalities, processes, flags,
   exam dates. **Re-runnable** (`upsert` on `acronym` / `(universityId, slug)`).
2. Scraper extractor — fetches portal → writes CSV (snapshot mode is deterministic).
3. `apps/scraper/src/loaders/seed.ts` — reads CSV, bulk-loads applicants/results,
   computes cutoffs and totals. A new university implements `UniversitySeeder`
   (`apps/scraper/src/loaders/types.ts`) and is registered in that file's `seeders[]`.

The research YAML does not run; it is the **specification** that the seed and the
extractor are written against, plus the audit trail of where every flag came from.

---

## Step 5 — Agent checklist (follow in order)

For a NEW university (or a new process of an existing one):

- [ ] **0. Confirm scope.** One `process_id` per file. Identify university acronym +
      city; confirm it (or add it) in `seed.ts` `UNIVERSITIES` as `coming_soon`.
- [ ] **1. Find sources.** Locate reglamento PDF, prospecto/cuadro de vacantes, and the
      results portal URL pattern. Record them in the file header with `[✓]`/`[~]`.
- [ ] **2. Copy the template.** `cp docs/templates/research.template.yaml
      apps/scraper/src/universities/<acronym-lower>/research/<process_id>.yaml`.
- [ ] **3. Fill flags** (áreas, modalities, min-score, segunda opción, sessions, partial
      process) — each with a source + `[✓]`/`[~]`. Unknown → `null`/`TODO` + source to
      check. **Never invent numbers.**
- [ ] **4. Fill exam structure + scoring** from the reglamento. Record general vs.
      special exams separately if they differ.
- [ ] **5. Fill jornadas** (dates/areas/notes) from the cronograma anexo.
- [ ] **6. Fill vacancies** from the cuadro de vacantes (cite the source). Skip any you
      can't cite.
- [ ] **7. Cross-check vs. CSV** once results are scraped: min admitted score vs.
      threshold, modality codes present, segunda-opción observations, row counts. Mark
      these `[✓]` (CSV).
- [ ] **8. Map to DB.** Transcribe flags/dates into `seed.ts`; ensure the per-process
      flags model has every field this university needs (extend the model if not).
- [ ] **9. Sanity pass.** Every non-obvious line has a confidence marker; no invented
      specifics; cross-process history blocks updated; `notes:` summarizes anomalies.

Naming reminders (root `CLAUDE.md`): code identifiers in **English**, user-facing copy
in **Spanish**; keep raw portal values verbatim (e.g. `"ALCANZO VACANTE"`). Code/DB say
**Proceso**; UI says **Examen** — never mix.

---

## Step 6 — UNICA specifics (next target)

A starter stub lives at
`apps/scraper/src/universities/unica/research/2026-I.stub.yaml`. It captures only what
is *reasonably knowable today* and marks every uncertain fact as `TODO` with the source
to verify. **Do not promote it to a real `2026-I.yaml` until the TODOs are confirmed
against UNICA's official reglamento/prospecto.** Open it, work the checklist above, and
confirm each `[~]`/`TODO` against primary sources before seeding.
