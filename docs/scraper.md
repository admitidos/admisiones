# Scraper reference

> Read this only when working on `apps/scraper/`. The scraper is a **batch job run
> 2–3×/year** — it is not where product value lives. Make it correct, not elegant.

## Pipeline

```
Extractor → JSON files (apps/scraper/data/, gitignored) → seed → DB
```

Each university has its own extractor. Intermediate JSONs are gitignored; `.gitkeep`
tracks the folder. The two steps run sequentially via pnpm scripts joined with `&&`.

## UNMSM

- Portal: `admision.unmsm.edu.pe/Website[YEAR][PERIOD][TYPE]/`
- Sub-portals per process: General, Especial, Cobertura, Por Resolución
- Columns: `CODIGO | APELLIDOS Y NOMBRES | ESCUELA PROFESIONAL | PUNTAJE | MERITO | OBSERVACIÓN`
- **Admitted detection:** `MERITO` has a number AND `OBSERVACIÓN = "ALCANZO VACANTE"`
- Area from URL path (`/A/` → Área A); campus from program-name suffix (`— Sede X`)
- DNI is **not** published (privacy)
- One exam, but different per área: the same proceso runs across 4 separate dates
  (Saturdays/Sundays), grouped by área. Medicina Humana gets its own exclusive date.
- Áreas: A (Salud), B (Ciencias Básicas), C (Ingenierías), D (Económicas),
  E (Humanidades y CC.JJ.)
- Modalidades: EBR/Ordinaria (default), Especial, Cobertura, Por Resolución — each has
  its own ingresante list and its own corte
- Some careers have multiple sedes; sede is a suffix in the scraped name and is treated
  as a SEPARATE career entry
- ~26,000–28,600 postulantes per proceso

## UNI

- Portal: `puntajes.admision.uni.edu.pe/admision/resultados-finales/`
- 3 sessions (DIAD), each evaluating different subjects:
  - Jornada 1: Razonamiento matemático/verbal + Humanidades
  - Jornada 2: Matemática pura (aritmética, álgebra, geometría, trigonometría)
  - Jornada 3: Ciencias (física, química, biología)
- Final score is **cumulative** across the 3 jornadas. Store per-session scores in the
  `ResultScore` table (one row per session) — **never** a JSON blob.
- No área system — all postulantes compete across engineering careers
- Results portal keeps data only ~60 days after publication — **scrape immediately**
- ~6,000 postulantes

## UNSA / UNSAAC (Phase 2)

- UNSA: Arequipa, ~49,500 applicants/year (largest in Peru, not Lima), 3 areas
  (Biomédicas, Ingenierías, Sociales)
- UNSAAC: Cusco, portal TBD

## Applicant-volume ranking (for prioritization)

1. UNSA (Arequipa) ~49,500/yr
2. UNMSM (Lima) ~28,600
3. UNSAAC (Cusco) ~18,200
4. UNHEVAL (Huánuco) ~16,100
5. UNFV (Lima) ~11,500
6. UNI (Lima) ~6,000
</content>
</invoke>
