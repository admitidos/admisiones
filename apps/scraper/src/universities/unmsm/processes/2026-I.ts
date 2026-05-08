/**
 * UNMSM 2026-I extractor
 *
 * Portal root : https://admision.unmsm.edu.pe/Website20261/
 * HTML format : new (2026-I+) — Base64-obfuscated names, data-score/data-merit attributes
 * Modalities  : A only (EBR/EBA) — the only one published as of May 2026
 *
 * Run (snapshot mode — deterministic, no network if snapshots exist):
 *   pnpm extract:unmsm:2026-I
 *
 * Run (live mode — forces fresh network fetch and overwrites snapshots):
 *   pnpm extract:unmsm:2026-I -- --live
 */
import { load } from 'cheerio';
import { fetchHtml, LIVE, sleep } from '../../../lib/http';
import { parseNewFormatPage } from '../shared/parser-new';
import { writeCSV } from '../shared/csv';
import type { UNMSMModality, UNMSMRow } from '../shared/types';

const PROCESS_ID = '2026-I';
const BASE_URL = 'https://admision.unmsm.edu.pe/Website20261';
const SLUG = 'unmsm';

interface ModalityConfig {
  code: UNMSMModality;
  label: string;
  /** URL of the page that lists all program links for this modality. */
  indexUrl: string;
  /** Base URL for individual program result pages: {programBase}/{code}/results.html */
  programBase: string;
  snapshotPrefix: string;
}

const MODALITIES: ModalityConfig[] = [
  {
    code: 'A',
    label: 'Educación Básica Regular (EBR) y Educación Básica Alternativa (EBA)',
    indexUrl: `${BASE_URL}/A/A.html`,
    programBase: `${BASE_URL}/A`,
    snapshotPrefix: `${SLUG}/${PROCESS_ID}/A`,
  },
];

async function discoverProgramCodes(config: ModalityConfig): Promise<string[]> {
  const html = await fetchHtml(config.indexUrl, `${config.snapshotPrefix}/_index`);
  const $ = load(html);

  const codes: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    // Program links: "0912/results.html" or "./0912/results.html"
    if (!href.endsWith('results.html')) return;
    const code = href.replace(/^\.\//, '').replace('/results.html', '').trim();
    if (code) codes.push(code);
  });

  return codes;
}

async function scrapeModality(config: ModalityConfig, scrapedAt: string): Promise<UNMSMRow[]> {
  console.log(`\nModality ${config.code}: ${config.label}`);

  const codes = await discoverProgramCodes(config);
  console.log(`  Discovered ${codes.length} programs`);

  const allRows: UNMSMRow[] = [];
  let skipped = 0;

  for (const code of codes) {
    const url = `${config.programBase}/${code}/results.html`;
    const snapshotKey = `${config.snapshotPrefix}/${code}`;

    try {
      const html = await fetchHtml(url, snapshotKey);
      const rows = parseNewFormatPage(html, PROCESS_ID, config.code, scrapedAt);
      allRows.push(...rows);
      if (LIVE) await sleep(300);
    } catch (err) {
      skipped++;
      console.warn(`  [skip] ${code}: ${(err as Error).message}`);
    }
  }

  if (skipped > 0) console.warn(`  ${skipped} program(s) skipped due to errors`);

  return allRows;
}

async function main(): Promise<void> {
  console.log(`UNMSM ${PROCESS_ID} — ${LIVE ? 'live (overwriting snapshots)' : 'snapshot mode'}`);
  const scrapedAt = new Date().toISOString();

  for (const modality of MODALITIES) {
    const rows = await scrapeModality(modality, scrapedAt);

    // Sort by program name then by rank (admitted first, then by rank ascending, then unranked last)
    rows.sort((a, b) => {
      const prog = a.program_clean.localeCompare(b.program_clean, 'es');
      if (prog !== 0) return prog;
      if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
      if (a.rank !== null) return -1;
      if (b.rank !== null) return 1;
      return 0;
    });

    const admitted = rows.filter((r) => r.admitted).length;
    console.log(`  Total rows: ${rows.length.toLocaleString()} (${admitted.toLocaleString()} admitted)`);

    await writeCSV(rows, SLUG, PROCESS_ID, modality.code);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
