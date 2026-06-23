# admitidos.pe

Contextualización de resultados de admisión de universidades públicas del Perú.

Las portales oficiales publican los resultados sin contexto: solo sabes si ingresaste o no. **admitidos.pe** te dice qué significa tu puntaje — tu posición en el área, cuánto te faltó para el puntaje de corte, y en qué otras carreras habrías ingresado.

## Universidades

| Universidad | Estado |
|---|---|
| UNMSM — Universidad Nacional Mayor de San Marcos | Activo |
| UNI — Universidad Nacional de Ingeniería | Próximamente |
| UNICA — Universidad Nacional San Luis Gonzaga de Ica | Próximamente |

## Stack

- **Web**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **DB**: PostgreSQL + Prisma 7
- **Scraper**: Node.js + tsx
- **Testing**: Storybook (component states) + Playwright (E2E)
- **Package manager**: pnpm workspaces
- **Deploy**: Vercel

## Structure

```
admitidos-pe/
├── apps/
│   ├── web/       ← Next.js app
│   └── scraper/   ← data extraction pipeline (batch job, 2–3×/year)
└── packages/
    └── db/        ← shared Prisma schema and client (@admitidos/db)
```

## Documentation map

| Doc | Purpose |
|---|---|
| [`PRODUCT.md`](./PRODUCT.md) | The **why** — vision, personas, emotional rules, screen specs, decisions log |
| [`CLAUDE.md`](./CLAUDE.md) | The **how** — operational guide for Claude Code / contributors |
| [`docs/`](./docs) | Deep reference — scraper, database, design system, screens & testing |
| `memory/` | Evolving decisions and real-user feedback |

## Development

**Prerequisites**: Node.js 20+, pnpm, a running PostgreSQL instance.

```bash
# install dependencies
pnpm install

# set up environment
cp .env.example .env
# fill in DATABASE_URL in .env

# run migrations and seed universities
pnpm db:migrate
pnpm db:seed

# start the web app
pnpm dev
```

## Data pipeline

Results are scraped from official university portals and loaded into the database.

```bash
# scrape and load a specific university
pnpm pipeline:unmsm
pnpm pipeline:uni

# or all at once
pnpm pipeline:all
```

Intermediate JSON files are written to `apps/scraper/data/` (gitignored) and then bulk-loaded via Prisma.

## Testing

```bash
# component states in isolation
pnpm --filter web storybook

# end-to-end flows
pnpm --filter web exec playwright test
```

Stateful components have a `.stories.tsx` beside them; E2E specs live in `apps/web/e2e/`
and target elements via `data-testid`.

## License

MIT
