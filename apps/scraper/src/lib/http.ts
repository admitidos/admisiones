import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SNAPSHOT_DIR } from './paths';

// Pass --live to force fresh network fetches and overwrite existing snapshots.
export const LIVE = process.argv.includes('--live');

/**
 * Fetch a URL and cache the raw HTML as a local snapshot.
 *
 * On subsequent runs without --live, the snapshot is returned immediately —
 * no network request is made. This is the primary determinism guarantee:
 * same snapshot → same parse output every time.
 *
 * snapshotKey is a slash-separated path relative to data/snapshots/, e.g.
 * "unmsm/2026-I/A/091". The .html extension is added automatically.
 */
export async function fetchHtml(url: string, snapshotKey: string): Promise<string> {
  const snapshotPath = path.join(SNAPSHOT_DIR, `${snapshotKey}.html`);

  if (!LIVE && existsSync(snapshotPath)) {
    process.stdout.write(`  [cache] ${snapshotKey}\n`);
    return readFile(snapshotPath, 'utf-8');
  }

  process.stdout.write(`  [fetch] ${url}\n`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  const html = await res.text();

  await mkdir(path.dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, html, 'utf-8');

  return html;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
