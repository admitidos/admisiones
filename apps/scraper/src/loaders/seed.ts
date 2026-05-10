// Step 2: reads scraped CSV files and bulk-loads into the database via Prisma.
// Run after `packages/db/prisma/seed.ts` (universities, modalities, processes must exist first).
import { prisma } from "@admitidos/db";
import type { UniversitySeeder } from "./types";
import { UnmsmSeeder } from "./unmsm";

const seeders: UniversitySeeder[] = [
  new UnmsmSeeder(),
  // new UniSeeder(),
];

async function main() {
  for (const seeder of seeders) {
    await seeder.seed();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
