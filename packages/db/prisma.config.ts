import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Read directly (not prisma's `env()`, which throws when unset) so `prisma
    // generate` works at build time without a DB secret. migrate/seed are only
    // ever run with DATABASE_URL set, so they still get the real value.
    url: process.env.DATABASE_URL ?? "",
  },
});
