# UNMSM — Scraper & Data Guide

Maintainer reference for the Universidad Nacional Mayor de San Marcos admission scraper. Read this before touching any UNMSM extractor script.

---

## Quick reference: available processes

| Process | Root URL | Modalities available | HTML format |
|---|---|---|---|
| 2024-I | `Website20241/` | A (EBR/EBA) | Old |
| 2024-II | `Website20242/` | A, C, D, E, F, G, H, I, J, M, N, O | Old |
| 2025-I | `Website20251/` | A (EBR/EBA) | Old |
| 2025-II | See below (split portal) | A (EBR/EBA), D, E, F, G | Old |
| 2026-I | `Website20261/` | A (EBR/EBA) | **New (obfuscated)** |

Base URL: `https://admision.unmsm.edu.pe/`

> Pre-2024 processes are not publicly accessible online. Only these 5 are scrapeable.

### 2025-II portal split (anomaly)

2025-II was published across three separate root directories — this is unique to this process:

| Portal | Content |
|---|---|
| `Website20252GeneralA/` | General (EBR/EBA), **Area A only** — 18 programs (health sciences) |
| `Website20252General/` | General (EBR/EBA), **Areas B + C + D + E** — 93 programs |
| `Website20252Especial/` | Special modalities: Traslado Interno (D), Graduados (E), Traslado Externo Nacional (F), Traslado Externo Internacional (G) |

When scraping 2025-II General, you must crawl both `GeneralA` and `General` and merge the results.

---

## Modality codes

Each modality is a letter code used as both the directory name and the HTML file at the root of the process. These codes are consistent across processes.

| Code | Spanish name | Notes |
|---|---|---|
| `A` | Educación Básica Regular (EBR) y Educación Básica Alternativa (EBA) | Main exam — the vast majority of applicants |
| `C` | Primeros Puestos de Educación Secundaria | Top graduates from secondary school |
| `D` | Traslado Interno | Internal transfer between UNMSM programs |
| `E` | Graduados o Titulados | Applicants who already hold a degree |
| `F` | Traslado Externo Nacional | Transfer from another Peruvian university |
| `G` | Traslado Externo Internacional | Transfer from a foreign university |
| `H` | Deportista Calificado | Qualified athlete |
| `I` | Deportistas Calificados de Alto Nivel | High-performance athlete |
| `J` | Víctimas del Terrorismo | Terrorism victims (special access) |
| `M` | Comunidades Nativas | Indigenous communities |
| `N` | Personas con Discapacidad | Applicants with disabilities |
| `O` | Plan Integral de Reparaciones | Integral reparations plan |

Not all modalities appear in every process — 2024-I and 2025-I only published modality A.

---

## Area system

UNMSM groups programs into **5 subject areas** (Áreas). Area determines which exam questions apply and is required context for score comparison.

| Area | Subject cluster | Example programs |
|---|---|---|
| A | Ciencias de la Salud | Medicina Humana, Enfermería, Odontología, Farmacia |
| B | Ciencias Básicas e Ingeniería | Ingeniería Industrial, Sistemas, Física, Química |
| C | Ciencias Económicas y de la Gestión | Administración, Economía, Contabilidad |
| D | Humanidades y Ciencias Jurídicas y Sociales | Derecho, Psicología, Educación, Historia |
| E | Ciencias de la Salud — Veterinaria (sometimes merged with A) | Medicina Veterinaria |

**How area is stored in the portal:**

- **2025-II**: Area is explicit in the portal name (`Website20252GeneralA` = Area A; `Website20252General` = Areas B–E combined). Use the portal name to assign area.
- **2024-I, 2024-II, 2025-I**: All areas are in a single portal. Area must be derived from the program code using a lookup table (see `shared/areaCodes.ts`).
- **2026-I**: New structure — area is the second path segment in the program URL (`A/[area]/[program_code]/results.html`). Currently only Area A published.

> **Cross-area score comparison**: scores are NOT comparable across areas. A 1,200 in Area A ≠ 1,200 in Area C. Always tag results with their area and show an amber warning in the UI when comparing across areas.

---

## Portal URL structure

### Old format — 2024-I, 2024-II, 2025-I, 2025-II

```
https://admision.unmsm.edu.pe/
└── Website[YEAR][PERIOD]/
    └── index page  →  [MOD_LETTER].html
        │
        └── [MOD_LETTER].html  →  program list
            │
            └── ./[MOD_LETTER]/[PROGRAM_CODE]/0.html  ← SCRAPE THIS
```

Example for 2024-II, modality A, program 011 (Medicina Humana):
```
https://admision.unmsm.edu.pe/Website20242/A/011/0.html
```

### New format — 2026-I (and likely future processes)

```
https://admision.unmsm.edu.pe/
└── Website[YEAR][PERIOD]/
    └── index.html  →  [MOD_LETTER]/[MOD_LETTER].html
        │
        └── [MOD]/[MOD].html  →  program list
            │
            └── [MOD_CODE]/results.html  ← SCRAPE THIS (relative to parent dir)
```

Full path example for 2026-I, modality A, program 091 (Administración):
```
https://admision.unmsm.edu.pe/Website20261/A/091/results.html
```

### How to discover all program URLs

1. Fetch the process root (e.g. `Website20242/`) — get modality list
2. For each modality letter, fetch `[MOD].html` — get program `href` list
3. For each program, construct the results URL:
   - Old format: href is already `./[MOD]/[CODE]/0.html`
   - New format: href is `[CODE]/results.html`, resolve relative to the modality file's directory

---

## The pagination truth: DataTables client-side only

**There is no server-side pagination.** Every result page loads the COMPLETE dataset in a single HTML response. DataTables renders client-side pagination on top of the full `<tbody>`.

The numbered files `0.html`, `1.html`, `2.html`, etc. that appear under program directories are **byte-for-byte identical copies** of the same file — a CMS artifact. Fetching only `0.html` (or `results.html` for 2026-I) gives you all applicants for that program.

**Implication**: `fetch + cheerio` is sufficient for all processes. Playwright is not needed.

---

## HTML parsing: Old format (2024-I → 2025-II)

Table ID: `#tablaPostulantes`

Column order (0-indexed):

| Index | Header | Notes |
|---|---|---|
| 0 | `CODIGO` | Applicant code — text content of `<td>` |
| 1 | `APELLIDOS Y NOMBRES` | Full name — text content of `<td>` |
| 2 | `ESCUELA PROFESIONAL` | Program name — may include campus suffix |
| 3 | `PUNTAJE` | Score — parse as `float`, may be empty for absent |
| 4 | `MERITO E.P` | Rank within program — parse as `int`, `&nbsp;` = no rank |
| 5 | `OBSERVACIÓN` | Raw observation string — keep as-is |

```typescript
// Old format row extraction (cheerio)
const code    = $td.eq(0).text().trim();
const name    = $td.eq(1).text().trim();
const program = $td.eq(2).text().trim();
const score   = parseFloat($td.eq(3).text().trim()) || null;
const rank    = parseInt($td.eq(4).text().trim()) || null;
const obs     = $td.eq(5).text().trim();
```

Admitted detection (old format):
```typescript
const admitted = rank !== null && obs === 'ALCANZO VACANTE';
```

---

## HTML parsing: New format (2026-I+)

Table ID: `#tablaPostulantes` (same)

Column order is the same, but **data is not in `<td>` text** — it is in attributes:

| Column | Where the value lives |
|---|---|
| Código | `<td>` text content directly (not obfuscated) |
| Apellidos y Nombres | `<span class="obfuscated" data-auth="[BASE64]">` — decode with `Buffer.from(v, 'base64').toString('utf8')` |
| Escuela | Same — `<span class="obfuscated" data-auth="[BASE64]">` in the program `<td>` |
| Puntaje | `<td data-score="738.750">` — read `data-score` attribute |
| Mérito E.P | `<td data-merit="12">` — read `data-merit` attribute, empty string = no rank |
| Observación | `<td>` text content (not obfuscated) |

Admitted detection (new format): admitted rows carry `class="table-success"` on the `<tr>`.

```typescript
// New format row extraction (cheerio)
const code    = $td.eq(0).text().trim();
const name    = Buffer.from($td.eq(1).find('.obfuscated').attr('data-auth') ?? '', 'base64').toString('utf8');
const program = Buffer.from($td.eq(2).find('.obfuscated').attr('data-auth') ?? '', 'base64').toString('utf8');
const score   = parseFloat($td.eq(3).attr('data-score') ?? '') || null;
const rank    = parseInt($td.eq(4).attr('data-merit') ?? '') || null;
const obs     = $td.eq(5).text().trim();
const admitted = $tr.hasClass('table-success');
```

---

## Campus detection (all formats)

Some programs are offered at satellite campuses. Campus appears as a suffix in the program name field:

```
PSICOLOGÍA - CHILCA          →  program: PSICOLOGÍA,  campus: CHILCA
PSICOLOGÍA - VILLA RICA      →  program: PSICOLOGÍA,  campus: VILLA RICA
PSICOLOGÍA - HUARMEY         →  program: PSICOLOGÍA,  campus: HUARMEY
ADMINISTRACIÓN - LIMA        →  program: ADMINISTRACIÓN, campus: LIMA
```

Separator is ` - ` (space–hyphen–space). If no separator, campus is null (Lima main campus implied).

Main campus programs (no suffix) are Lima by default — do NOT add an implicit "LIMA" campus tag; only store explicit suffixes.

---

## CSV output structure

One CSV per modality per process. Place under `data/csv/unmsm/[process-id]/[modality-code].csv`.

Example: `data/csv/unmsm/2024-II/A.csv`

| Column | Type | Description |
|---|---|---|
| `process_id` | `string` | e.g. `2024-II` |
| `modality` | `string` | Letter code: `A`, `C`, `D`... |
| `code` | `string` | Applicant admission code |
| `full_name` | `string` | Raw APELLIDOS Y NOMBRES — no normalization |
| `program_raw` | `string` | Exact value from portal (including campus suffix) |
| `program_clean` | `string` | Stripped of campus suffix |
| `campus` | `string \| ""` | Campus suffix, or empty string |
| `area` | `string` | `A` \| `B` \| `C` \| `D` \| `E` |
| `score` | `number \| ""` | PUNTAJE — empty if absent/null |
| `rank` | `number \| ""` | MERITO — empty if no rank |
| `observation` | `string` | Raw OBSERVACIÓN value |
| `admitted` | `boolean` | Derived admission status |
| `scraped_at` | `string` | ISO 8601 UTC timestamp of when snapshot was fetched |

---

## Reproducibility: snapshot strategy

Each scraper fetches live HTML once and saves it to `data/snapshots/unmsm/[process-id]/[modality]/[program-code].html`. Subsequent runs parse from the snapshot. A `--live` flag forces a fresh network fetch.

This means: re-running the same extractor script always produces identical CSV output.

---

## Historical process notes

These are process-specific rules that affect data interpretation. **This section needs to be completed with official UNMSM documentation research** — the items marked ⚠️ are known variables that the scraper and DB schema depend on but haven't been confirmed yet from primary sources.

### Minimum score threshold (`hasMinScoreFilter`)

⚠️ **Research needed.** UNMSM has applied a minimum score rule in some processes where applicants below a threshold do not appear in published results at all. This means the portal does not show absent/rejected rows — only those who reached the floor.

Known implications:
- When `hasMinScoreFilter = true`, percentile calculations must account for the hidden population.
- The DB `Process` model has a `hasMinScoreFilter` boolean and `minScoreThreshold` float for this.
- Which specific processes applied this rule (and what threshold they used) requires verification from official UNMSM resolutions or prospectuses.

### Segunda opción / opción múltiple

⚠️ **Research needed.** At certain points, UNMSM allowed applicants to list a second program preference. If their first-choice program rejected them and their score met the second program's cutoff, they could be admitted there.

Known implications:
- An applicant may appear admitted in a program that was not their primary choice.
- The CSV and DB do not capture "which was the applicant's first choice" — that data is not published in the portal.
- Need to confirm: which processes had this mechanism? Was it active in 2024 or 2025?

### Score system changes

Scores have not always been on the same scale. UNMSM has changed the exam format and weighting at various points.

⚠️ **Research needed.** Before comparing scores across processes for cutoff tendency charts, confirm that the score scales are compatible. A 1,200 in 2024-I may not be equivalent to a 1,200 in 2020-I.

### Observation values

Known values from the portal (raw strings, keep as-is in CSV):

| Raw value | Meaning | Format |
|---|---|---|
| `ALCANZÓ VACANTE` | Admitted | 2026-I+ (accented) |
| `ALCANZO VACANTE` | Admitted | Pre-2026 (no accent) |
| (blank) | Not admitted (scored below cutoff) | all |
| `AUSENTE` | Absent (did not take the exam) | all |
| `INHABILITADO` | Disqualified | unconfirmed |

> Map to the `status` enum at seed time, not during scraping. Both spellings must map to `admitted`.

⚠️ Confirm whether other observation values exist (e.g., annulled exams). Parse as a raw string and map to the `status` enum at load time, not during scraping.

---

## Scraping checklist for a new process

When UNMSM publishes a new process, before writing the extractor:

1. [ ] Confirm the root URL (portal may add a suffix like `GeneralA` — check manually)
2. [ ] Check which modalities are published (not all may be available on day one)
3. [ ] Verify HTML format: check if data is in `<td>` text (old) or `data-auth`/`data-score` attributes (new)
4. [ ] Check if the numbered file pattern applies (`0.html`) or if it uses `results.html`
5. [ ] Confirm area assignment strategy (from URL, from portal name, or from program code lookup)
6. [ ] Verify `ALCANZO VACANTE` is still the admitted observation string
7. [ ] Note any new modalities not in the table above
