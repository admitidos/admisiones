# admitidos.pe — Project Brief & Decisions Log

> This document is the full business and product context for admitidos.pe — the **WHY**.
> It contains the concept, personas, emotional rules, the screen flows, the decisions
> log, and the open questions. It is durable and changes rarely.
>
> **Companion files:** `CLAUDE.md` = the operational HOW (lean). `docs/*.md` = deep
> technical reference, read on demand. `memory/` = evolving decisions + real-user feedback.

> ### ⚠️ SUPERSEDED SINCE THIS BRIEF WAS WRITTEN — read this first
> A few decisions below were later revised. Where they conflict, **these win**:
> - **Palette (§7):** "Verde logro" was replaced by the **Degradado índigo** theme —
>   accent `#4338ca`, hero `linear-gradient(145deg, #1e1b4b → #0f766e)`. This is what
>   is live in `globals.css`. Green is now reserved **only** for admitted states.
>   The §7 palette is kept as history. See `docs/design-system.md` for current tokens.
> - **Stack (§11):** the real stack is **Next.js 16, Prisma 7, PostgreSQL** (no SQLite,
>   no Turso). The DB-provider question is settled on Postgres.
> - **Prime directive:** the current #1 priority is **ship thin + add analytics**, then
>   iterate on design from real result-day traffic and feedback. The scraper is a batch
>   job run 2–3×/year — do not over-invest in it. See `CLAUDE.md` → "Prime directive".
>
> Everything else below (personas, emotional rules, screen flows, decisions log) stands.

---

## 1. The concept

admitidos.pe aggregates and contextualizes admission results from Peruvian
public universities (starting with UNMSM and UNI). It is **not** an official
university portal — it is a UX and interpretation layer on top of the raw
data that official portals publish without any context.

**The core value proposition:** not just _whether_ you got in, but _what your
result means_. If a postulante scored 1,255 in Medicina at San Marcos, the
official portal just says "no ingresó". admitidos.pe says: you were in the
top 62% of all applicants, you needed 47 more points, and with that score you
would have gotten into Farmacia, Enfermería, and Nutrición.

**Why this matters:** the day results come out, hundreds of thousands of
anxious students and their families search for their results. The official
portals are slow, collapse under load, often delete historical data after
60 days, and present nothing but a name and a number. There is a clear gap
for a fast, mobile-first, empathetic, context-rich experience.

---

## 2. Founder context

The founder (Daniel Guzmán) grew up outside Lima with limited access to
quality exam preparation, and experienced firsthand the difficulty of studying
alone without feedback. This lived experience is central to the product vision:
**the primary persona is the student who studies alone and cannot afford an
in-person academy.** This is not just a results portal — it is built with
empathy for the emotional weight of the admission process.

The project also serves as a portfolio piece for edtech applications or
graduate programs, and the stated primary goal is **profitability** — generating
enough recurring revenue to eventually replace a salary.

---

## 3. The two products (and the open question about combining them)

There are two interconnected products under the same vision:

### 3a. admitidos.pe (THIS project — the results & statistics portal)

The focus of all current development. A results portal for Peruvian public
university admissions. This is what we are building now.

### 3b. AI-powered UNMSM exam prep product (FUTURE — separate track)

An AI exam-prep product focused on the DECO (Destrezas Cognitivas) format.
Core mechanic: a "mastery loop" / "Rabbit Hole" — a wrong answer triggers an
AI explanation of _why_ the wrong option was tempting and why the correct one
is right, followed by micro-reinforcement questions and spaced repetition.
This is in pre-build validation (a manual "Wizard of Oz" test was the agreed
next step before writing any code).

> **OPEN QUESTION (unresolved):** whether and how to combine or keep separate
> the two products. The results portal is the acquisition channel; the exam-prep
> tool is the monetization engine. They likely share an audience but serve
> different moments (post-exam vs pre-exam). For now they are SEPARATE tracks.
> admitidos.pe ships first.

---

## 4. The users (personas)

Three distinct users arrive at the product with different needs. Every design
decision should serve at least one of them without confusing the others.

### Postulante — day of results (17–22 yrs)

- Arrives anxious, from a Google search, the day results are published.
- ~20–30 seconds of patience. On mobile, possibly on slow data.
- Wants to know if they got in within 2 seconds of the page loading.
- If they did NOT get in, they need to feel they were _close_ and can try
  again — never that they failed.
- Shares their result on WhatsApp.

### Padre / madre (35–55 yrs)

- Arrives because their child sent the link, or via Google.
- Wants to understand what the result _means_ in context.
- Reads more, scrolls, compares options.
- Needs the site to look trustworthy and institutional — not like a blog.

### Postulante — pre-examen (15–20 yrs)

- Arrives weeks before the exam to research.
- Wants to know what score they need, how hard a career is historically,
  when the exam is, and how they compare.
- The most curious, highest-engagement user. Visits the most pages.

---

## 5. Tone, voice, and emotional design rules

The product should feel like **a knowledgeable friend who explains things
without jargon** — empathetic, direct, honest. Never cold or bureaucratic.
Never alarmist.

### Hard rules (do not break these)

- **NEVER use red for admission results.** Red = error/danger, the opposite
  of what we want to communicate to someone who did not get in. Use amber/
  copper (#D97706, #92400E, hero #B45309) for the "no ingresó" state — it
  reads as "close, keep going" rather than "failure".
- Green is the central color because it universally communicates achievement
  ("pasé el semáforo").
- Informational text (stats, metadata, labels) is always black/gray. Accent
  colors are reserved for actions, badges, and emphasis — never for body text
  or data values.
- The "no ingresó" experience must give hope and orientation. Always end with
  a path forward, never just a verdict.
- Share button is present in BOTH states — someone who didn't get in may still
  want to share with family.

### Voice examples

- Positive: "¡Ingresaste! Ocupas el puesto 9 de 55 vacantes."
- Negative: "No ingresaste esta vez. Te faltaron 47 puntos — estuviste en el
  top 12%."

---

## 6. Naming convention — Proceso vs Examen (DECIDED)

There are two contexts for this terminology:

- **In the UI (user-facing): always "Examen"** — the 17–22 yr old user thinks
  "el examen de San Marcos", not "el proceso de admisión". Applies to navbar
  labels, card titles, page headers, any user-visible copy. The navbar link
  is **"Exámenes pasados"**.
- **In code and the database: always "Proceso"** — technically more precise
  and avoids naming conflicts, because a Proceso contains multiple Jornadas
  (individual exam dates). If the entity were "Examen", a Jornada would be
  "an exam within an exam" — ambiguous.

Mapping:

- `Proceso` = the full admission convocatoria (e.g. UNMSM 2026-I)
- `Jornada` = each individual exam date within that Proceso

Translation happens only at the presentation layer. URLs stay neutral
(`/unmsm/2026-1`).

---

## 7. Design system (palette only — UI may be redesigned)

> The flow is fixed; the visual design may change. Only the palette is locked.

**Fonts:** Fraunces (serif) for display/headlines/large numbers; Plus Jakarta
Sans for all UI and body text.

**Verde logro palette:**

```
--bg:        #F3F4F1   off-white with slight green tint
--surface:   #FFFFFF
--border:    #E5E7EB
--text:      #111827
--muted:     #6B7280
--hint:      #9CA3AF
--green:     #15803D   primary accent
--green-l:   #F0FDF4
--green-m:   #BBF7D0
--green-d:   #14532D
--indigo:    #1e3a8a   used in hero gradient
--amber:     #D97706   "no ingresó" / corte marker — NEVER red
--amber-l:   #FFFBEB
--amber-d:   #92400E
--amber-b:   #FDE68A
```

**Hero gradient:** `linear-gradient(110deg, #15803D 0%, #1e3a8a 100%)`
(verde → índigo, left to right).

**University accent colors** (for chips, timeline dots, card borders):

```
UNMSM:   #15803D (green)
UNI:     #B45309 (copper/amber)
UNFV:    #7C3AED (violet)
UNSAAC:  #0F766E (teal)
UNSA:    #0369A1 (blue) — future
```

**Semantic fixed colors** (do not change): success/over-corte #16A34A.

---

## 8. The screens — flow and status

The flow is considered FIXED. Visual redesign is allowed; the flow is not
expected to change.

### Navigation — navbar (MVP, DECIDED)

```
[logo: admitidos.pe] | Inicio · Exámenes pasados · Próximos exámenes | [CTA verde dinámico]
```

- No search bar (removed by product decision — see section 10 for why).
- The CTA is dynamic: always points to the most recently published proceso.
  Its text updates: "Ver resultados UNMSM 2026-I →".
- Only two real nav links beyond Inicio.

### Footer — always present

"Hecho con [coffee cup SVG] por Daniel Guzmán". Coffee icon is SVG, not emoji.

---

### Screen 1 — Home (DESIGNED, "Opción B" chosen)

**Purpose:** get the right user to the right place in minimum time.

**Decided structure:**

- Hero with verde→índigo gradient, centered, small headline (not the giant
  one from earlier iterations): "Consulta tu resultado de admisión" + a one-line
  subtitle reframing the value prop ("No solo tu puntaje — entiende qué significa").
- **The most recent exam is the most prominent element** (this was an explicit
  decision). It emerges as a card from the bottom of the hero: green header
  strip "Último examen publicado", university, process name, a 4-stat row
  (postulantes / vacantes / carreras / tasa ingreso), and a large CTA button
  "Ver resultados de este examen".
- Below: "Exámenes pasados" list (only PUBLISHED exams — never upcoming ones
  in this list) with a filter (Todos / UNMSM / UNI). Each row: university,
  process name, metadata, date, "Publicado" badge.
- "Universidades" grid: active universities (UNMSM, UNI) with logos that are
  grayscale by default and reveal color on hover. "Próximamente" universities
  (UNSA, UNSAAC) shown with dashed border and reduced opacity to communicate
  roadmap without promising what doesn't exist.
- Single column. No sidebar. No stats panel (removed — impressive but not
  actionable for MVP).

---

### Screen 2 — Resultado individual (DESIGNED — most critical screen)

URL: `/[uni]/[proceso]/postulante/[codigo]`

**Purpose:** the most emotional screen. Answer "did I get in?" in <2 seconds,
contextualize the result, and if they didn't get in, give hope and orientation.

**Pre-requisite flow (IMPORTANT for UNMSM):** a postulante cannot reach their
result without first knowing their **modalidad, carrera, and sede**. UNMSM
publishes some careers with sede suffixes as separate entries (e.g. "Medicina
Humana" vs "Medicina Humana — Sede San Fernando"). The resultado page header
must ALWAYS show: **modalidad · carrera · sede**, at the same level of
importance as the postulante's name.

**Two distinct states:**

**State A — Ingresó:**

- Hero in green. Name, then the score as the largest typographic element
  (like a scoreboard). Puesto as a medal badge (🏅).
- Position bar with THREE markers: mínimo del área, corte (amber marker),
  máximo. Shows where they landed in the range of admitidos, not just that
  they passed.
- Three context stats: puntos sobre el corte (+149, green), total postulantes,
  tasa de ingreso.
- Puesto within full área universe ("Puesto 9 entre 4,709 postulantes Área A"),
  not just within the carrera.
- Corte tendency: delta vs previous proceso (↑ +18 pts).
- Historical corte chart — last 4 procesos, current one highlighted.
- "Con tu puntaje también habrías ingresado a" — same-área careers, green
  chips with point surplus.
- "Tu carrera" section: facultad, sede, área, vacantes trend.
- "Otras áreas — referencial" — collapsed by default, amber warning that the
  exam has different sections so comparison is only orientative.

**State B — No ingresó:**

- Hero in amber/copper (#B45309), NEVER red.
- Instead of puesto: how many points short (−47, amber).
- Proximity as a percentage ("Alcanzaste el 96% del puntaje de corte") — far
  more motivating than "−47 pts".
- Percentile among all rendidores ("Superaste al 62%").
- Estado badge distinguishing: "No alcanzó vacante" / "Ausente" / "Inhabilitado".
  These are NOT the same outcome and must never be shown identically.
- Position bar fill stops just before the corte marker (visually communicates
  "casi").
- "Carreras a las que SÍ habrías ingresado" — green chips (real achievements).
- "Cuánto te faltó" — amber progress bars, nearly-full bar = very close.
- Orientative note using historical data: "Con tu puntaje habrías ingresado en
  X de los últimos 4 procesos" — answers "should I try again?".
- "Tu carrera postulada" section — same as State A.

---

### Screen 3 — Próximos exámenes / Calendario (DESIGNED — vertical timeline)

URL: `/proximos-examenes`

**Purpose:** answer three questions for the pre-examen user: when is my exam,
how much time do I have to prepare, and what is evaluated each day.

**Decided structure (after several iterations):**

- A **vertical timeline**, NOT a grid calendar. (We explicitly decided against
  a calendar grid mode — the timeline already conveys date order, duration via
  sessions, and university grouping; a grid would lose the jornada detail. A
  per-exam "Add to calendar" link is the better future addition instead.)
- **The date is the node of the timeline** — the day number in large Fraunces
  is the most prominent visual element of each item (not a month label). Items
  are ordered by date, NOT grouped by month.
- Each exam card: colored left border + timeline dot by university, university
  name + city, process name, metadata, a countdown ("24 días para el examen")
  only when there's an exact upcoming date, and a sessions sub-list.
- **Sessions sub-list** is the key content — each jornada with its date,
  weekday, and one-line description of what's evaluated. This is what explains
  why UNMSM has 4 Saturdays/Sundays (same exam, different áreas per day) and
  why UNI has 3 consecutive days (different subjects each day, cumulative score).
- **Filter by university** via chips at the top (sticky below navbar). This was
  chosen over region filtering because many students from regions (e.g. Ica,
  Cusco) still apply to San Marcos — the university applied-to, not the region,
  determines interest. Chips show logo initials + popular name + city
  (e.g. "San Marcos / Lima") because acronyms like UNSAAC are unknown to many.
- Minimalist — NO sidebar, NO legends, NO "why several Sundays" explanation
  card (the design self-explains via the sessions list).
- **Empty states (DECIDED behavior):**
  - A university with no data yet (UNFV) shows an informative card in its
    timeline position ONLY when selected: "Sin cronograma publicado aún" +
    when it usually publishes + context (carreras, postulantes/year).
  - A "coming soon" university (UNSAAC) shows "Próximamente en admitidos.pe"
    when selected.
  - When NO universities are selected, the timeline is replaced with a
    call-to-action empty state ("¿A cuál vas a postular?" + invitation to
    select universities).
  - Deselecting all universities is allowed.

**MVP universities for this screen (DECIDED):** UNMSM, UNI, UNFV, UNSAAC.

- UNMSM and UNI: show actual upcoming exams with full session detail.
- UNFV: "no info yet, usually publishes between [dates]".
- UNSAAC: "coming soon".

**Analytics note:** the university filter chips are an analytics goldmine.
Each chip click is an event revealing which universities the audience cares
about. A hook was left in the prototype JS (`analytics.track('filter_university', ...)`)
for when an analytics tool (PostHog / GA4 / Mixpanel) is integrated. The plan
is to add usage analytics in the future to understand user interaction.

---

### Screen 4 — University hub (PLANNED, partially designed)

URL: `/[uni]`

**Purpose:** landing for each university; list of careers grouped by área,
with a modalidad selector. Entry point to the career statistics flow.

**Decided structure:**

- Single column, max 680px.
- Career list with área chips (A–E for UNMSM) that filter inline.
- A **modalidad selector** at the top. Default "EBR / Ordinaria". Others:
  Especial, Cobertura, Por Resolución. Changing modalidad reloads the list.
- Each career row: área badge, name, sede if not Lima, difficulty badge, last
  corte. Tapping goes to that career's statistics page.

---

### Screen 5 — Career statistics (DESIGNED — the storytelling page)

URL: `/[uni]/carreras/[codigo]`

**Purpose:** answer "how hard is it to get into this career, and what score do
I need?" Tells a sequential story. Used by an anxious user — difficulty verdict
must never feel like a threat.

**Sticky selector** below the career name: modalidad (default EBR) and sede
(default Lima; selector only appears if the career has multiple sedes, like
Medicina Lima vs San Fernando). Changing either updates ALL sections without
navigation. If a modalidad/sede combo has no data, show inline message.

**The six-section narrative (order matters):**

1. **Verdict** (no scroll): large career name (Fraunces) + qualitative
   difficulty verdict with supporting ratio. "Muy difícil — 86 postulantes
   por vacante" (more visceral than "1.09% tasa"). Then three numbers:
   vacantes / postulantes / tasa de ingreso.
   Difficulty mapping: Extrema 60+:1, Muy alta 30–59, Alta 15–29, Media 8–14,
   Accesible <8.

2. **Target score** ("¿Cuánto necesitas sacar?"): large central corte number
   with trend arrow (e.g. "1,302 ↑ +18 pts"). Below, three reference points:
   mínimo ingresante / mediana / máximo.

3. **Historical demand** ("¿Cuánta competencia hay?"): grouped bar chart, one
   pair per proceso (last 6) — gray bar = postulantes, green bar = ingresantes.
   The visual gap tells the story. One summary sentence below.

4. **Score trend** ("¿Se está volviendo más difícil?"): line chart of corte
   per proceso (6–8 procesos), horizontal dashed reference at current corte,
   light green area fill. A natural-language trend note (rising/stable/falling).

5. **Simulator** ("¿Con tu puntaje de simulacro, habrías ingresado?"): single
   input, instant text response as the user types (no button). Counts how many
   of the last 6 procesos the entered score would have cleared. Response always
   ends with a path forward (reinforce / name close processes / give concrete
   gap). No chart.

6. **Similar careers**: 4 cards max, same área only, sorted by closest corte.
   Tapping navigates to that career's stats page.

**Layout:** single column, max 680px, no sidebar — it's a storytelling page,
not a dashboard. Avoid: raw data tables (that's what official portals have),
the simulator at the top (users need to understand difficulty first), and pie
charts (1% slice is invisible — bars tell the story better).

---

## 9. Screen implementation priority

**Phase 1 (MVP — launch-ready):**

1. Home
2. Resultado individual (highest traffic, most critical)
3. Proceso / carrera list (with área filter)
4. Próximos exámenes (calendar timeline)
5. 404 empático
6. OG meta tags for resultado (WhatsApp sharing — critical for virality)

**Phase 2:** 7. University hub 8. Career statistics page (the storytelling page) 9. Global search within a proceso (~26,000 records — needs a build-time
search index, like Pagefind) 10. Dashboard de estadísticas

**Phase 3:** 11. Simulador pre-examen (standalone) 12. Multi-university home redesign (when 4+ universities are live) 13. "¿A qué otras carreras pude ingresar?" expanded feature

---

## 10. Decisions made (chronological log of what was settled)

- **Name:** admitidos.pe (with the "s", not admitido.pe).
- **Palette:** Verde logro chosen over 7 other explored palettes (Tierra
  dorada, Noche académica, Cobre peruano, Sol de verano, Academia noble,
  Cielo peruano, Eléctrico B&W). Later added a verde→índigo hero gradient.
- **No red, ever, for results.** Amber for "no ingresó". This was reinforced
  multiple times.
- **Text color rule:** secondary/informational text is always neutral
  (black/gray), never accent-colored — accent colors looked "forced" on small
  informational text.
- **Home direction:** "Opción B" — focused hero + most-recent-exam as the
  prominent element + clean exam list. No stats panel, no sidebar.
- **Navbar:** no search bar. Two links (Exámenes pasados, Próximos exámenes)
  - dynamic CTA. The search bar was removed because: searching a postulante by
    apellido across many exams is imprecise (thousands of "Quispe"), and nobody
    memorizes their 6-digit código. The search lives inside each proceso page
    instead, where the universe is already narrowed.
- **Calendar = vertical timeline**, not a grid. No calendar-grid toggle mode
  (decided against — low value for 4 universities). Date is the timeline node;
  items ordered by date, not grouped by month.
- **Calendar filter = by university** (chips), not by region. Chips show
  logo-initials + popular name + city.
- **MVP universities:** UNMSM, UNI, UNFV, UNSAAC (UNI + UNMSM with data, UNFV
  "no info yet", UNSAAC "coming soon").
- **"Exámenes pasados" list** never includes upcoming exams.
- **Career stats page:** six-section narrative, sticky modalidad/sede selector,
  default EBR + Lima.
- **University logos:** since real crests are too complex at small sizes, use
  initials-in-a-circle with university color (grayscale by default, color on
  hover) — the Linear/Notion/Slack pattern for third-party logos.

---

## 11. Tech stack decisions (summary — full detail in CLAUDE.md)

- **Framework:** Next.js 15 App Router (chosen over Astro after reconsideration,
  for `generateStaticParams` + mature SEO + single Vercel deploy).
- **Rendering:** static generation via `generateStaticParams` for all resultado
  routes. No `/api` folder needed for core product — Server Components call
  data functions directly. Career filtering is client-side (small dataset).
  ONE API route only if/when global postulante search across a full proceso
  is added (Phase 2).
- **ORM:** Prisma. Shared between the Next.js app and the scraper via a single
  package in a monorepo (`packages/db`) — schema is NOT duplicated.
- **DB:** SQLite local dev; Turso (SQLite over HTTP, edge-compatible) or Neon
  (Postgres) for production.
- **Monorepo:** pnpm workspaces. `apps/web` (Next.js), `apps/scraper` (Node.js),
  `packages/db` (shared Prisma).
- **Scraper:** two steps, run sequentially via pnpm scripts joined with `&&`
  (extract HTML→JSON, then seed JSON→DB). Output JSON is gitignored.
- **Architecture:** strict layering — pages call features (use cases), features
  call repositories, repositories call the DB. Pages never touch the DB directly.
- **Deployment:** single Vercel project for the web app.
- **Analytics (future):** a tool like PostHog/GA4/Mixpanel to understand user
  interaction. Hooks already conceptually placed (e.g. university filter clicks).

---

## 12. University-specific knowledge (data structure)

### UNMSM

- One exam, but DIFFERENT per área. The same proceso runs across 4 separate
  dates (Saturdays/Sundays), grouped by área. Medicina Humana gets its own
  exclusive date.
- Áreas: A (Salud), B (Ciencias Básicas), C (Ingenierías), D (Económicas),
  E (Humanidades y CC.JJ.).
- Modalidades: EBR/Ordinaria (default), Especial, Cobertura, Por Resolución.
  Each has its own ingresante list and its own corte.
- Some careers have multiple sedes; sede is a suffix in the career name in
  the scraped data and is treated as a SEPARATE career entry.
- Portal HTML: DataTable.js, columns CODIGO | APELLIDOS Y NOMBRES | ESCUELA |
  PUNTAJE | MERITO | OBSERVACIÓN. Ingresante = MERITO has a number AND
  OBSERVACIÓN = "ALCANZO VACANTE". DNI is NOT published (privacy).
- ~26,000+ postulantes per proceso.

### UNI

- Three exams for the SAME applicant (DIAD format), on 3 (often consecutive or
  alternating) days, each evaluating different subjects:
  - Jornada 1: Razonamiento matemático/verbal + Humanidades
  - Jornada 2: Matemática pura (aritmética, álgebra, geometría, trigonometría)
  - Jornada 3: Ciencias (física, química, biología)
- Final score is CUMULATIVE across the 3 jornadas. Store individual jornada
  scores (the schema has a `puntajesPorJornada` JSON field).
- No área system — all postulantes compete across engineering careers.
- Results portal only keeps data ~60 days after publication — scrape immediately.
- ~6,000 postulantes.

### University applicant volume ranking (relevant for prioritization)

1. UNSA (Arequipa) ~49,500/yr — largest in Peru, NOT Lima
2. UNMSM (Lima) ~28,600
3. UNSAAC (Cusco) ~18,200
4. UNHEVAL (Huánuco) ~16,100
5. UNFV (Lima) ~11,500
6. UNI (Lima) ~6,000

> Note: students from regions travel to study — e.g. many go to Ica (UNICA),
> Cusco (UNSAAC) from neighboring regions. This is why the calendar filters by
> university, not region.

---

## 13. Competitive landscape

- **Ciclero.guru** — the only real competitor with data. Has aggregated stats
  per career, ideal scores, simulacros, 10,000+ users. BUT: no individual
  result lookup (you can't search your own result, only see aggregate stats),
  UNMSM-only, desktop-oriented. This individual-lookup gap is the primary
  product opportunity.
- **Official portals** — slow, collapse on results day, UNI deletes data after
  60 days, not mobile-friendly, no context.
- **Media (La República, Infobae Perú, etc.)** — publish articles on results
  day that just link to the official portal. They rank high on Google that day
  via news SEO but have no product of their own. Opportunity: if admitidos.pe
  ranks for "resultados UNMSM 2026", it captures the traffic media only
  redirects. Requires aggressive technical SEO (static pages, exact process
  name in URL and H1).

### Six market gaps admitidos.pe fills

1. Individual personal search with context
2. Multi-university coverage
3. Permanent historical data (official portals delete it)
4. Mobile-first
5. "¿A qué más pude ingresar?" (alternative careers with your score)
6. Designed for parents, not just applicants

---

## 14. Launch timing (high-urgency window)

- UNMSM 2026-I results are the natural launch moment — a high-traffic window.
- UNI 2026-I results were already published (scrapeable now — first real data).
- The plan: scrape UNI (published) + prepare the UNMSM scraper for when results
  drop, then launch with those two.

---

## 15. Monetization & business constraints (for the future SaaS / exam-prep)

These apply more to the future exam-prep product but were modeled with real
Peruvian constraints:

- **Payment gateway:** Culqi (Stripe is unavailable with a local Peruvian
  account). Culqi supports recurring subscriptions, Yape integration, local
  bank deposits.
- **Culqi minimum fee per transaction** makes low price points (e.g. S/20/month)
  economically unfavorable — pricing above S/30–50 is likely necessary for unit
  economics to work.
- **Tax:** Régimen MYPE Tributario (RMT), IGV at 18%.

> OPEN QUESTION: pricing strategy for the exam-prep SaaS given Culqi's fee
> structure is not yet resolved.

---

## 16. Open questions & pending decisions

1. **Product combination:** keep admitidos.pe and the exam-prep tool separate,
   or integrate them? (Currently separate; admitidos.pe ships first.)
2. **Pricing strategy** for the future exam-prep SaaS given Culqi's minimum fee.
3. **DB provider for production:** Turso vs Neon (both work with Prisma; decision
   pending based on ops preference).
4. **Search feature scope:** when to build the global postulante search index
   (Phase 2) and with what tool (Pagefind or custom).
5. **User research not yet done:** no interviews with parents or applicants yet.
   The career-stats page structure is a hypothesis. A cheap validation step:
   search "puntaje mínimo medicina san marcos" on Google / Reddit Perú / TikTok
   comments to find the real questions in users' own words before committing.
6. **"Add to calendar" per exam** — proposed as a better addition than a
   calendar-grid view for the Próximos exámenes screen. Not yet built.
7. **Domain registration** — verify admitidos.pe availability and register.
8. **CI/CD pipeline** — GitHub Actions cron to re-scrape when new results drop;
   script to load CSV/JSON → build → deploy to Vercel automatically.

---

## 17. Validation discipline (a working principle)

The founder follows a validation-before-build discipline. The exam-prep
product's next step was explicitly a manual "Wizard of Oz" test (select ~10
DECO questions, test a prompt with an AI to generate criterion-based
explanations of wrong answers, evaluate quality) BEFORE writing any code.
Apply the same discipline to admitidos.pe features: validate the question a
screen answers before polishing its design.

---

## 18. Key learnings / principles to remember

- The DECO exam format rewards critical reasoning over memorization — this
  validates AI explanation of wrong-answer logic as the core differentiator of
  the future exam-prep product (not just answer delivery).
- The student who studies alone is the primary persona — not the one with
  academy access.
- UX decisions are made mobile-first and with emotional-state awareness as
  primary constraints.
- Financial modeling uses real Peruvian market constraints (local gateways,
  tax regimes) from the start, not retrofitted.
