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

- **Web**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **DB**: PostgreSQL + Prisma 7
- **Scraper**: Node.js + tsx
- **Package manager**: pnpm workspaces
- **Deploy**: Vercel

## Structure

```
admitidos-pe/
├── apps/
│   ├── web/       ← Next.js app
│   └── scraper/   ← data extraction pipeline
└── packages/
    └── db/        ← shared Prisma schema and client (@admitidos/db)
```

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

## License

MIT
