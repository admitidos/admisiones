import path from 'node:path';

// Resolved relative to process.cwd(), which pnpm always sets to the package root (apps/scraper/).
export const SCRAPER_ROOT = process.cwd();
export const SNAPSHOT_DIR = path.join(SCRAPER_ROOT, 'data/snapshots');
export const CSV_DIR = path.join(SCRAPER_ROOT, 'data/csv');
