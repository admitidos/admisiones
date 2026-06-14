import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @admitidos/db ships raw TS (main = src/index.ts) → Next must transpile it.
  transpilePackages: ["@admitidos/db"],
  // Keep the native pg driver and Prisma's runtime out of the server bundle —
  // the generated client loads these at runtime, not via the bundler.
  serverExternalPackages: ["@prisma/adapter-pg", "pg", "@prisma/client-runtime-utils", "@prisma/engines"],
};

export default nextConfig;
