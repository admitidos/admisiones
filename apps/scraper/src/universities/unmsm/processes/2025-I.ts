/**
 * UNMSM 2025-I extractor
 *
 * Portal root : https://admision.unmsm.edu.pe/Website20251/
 * HTML format : old — plain text in <td> cells, DataTables 1.13.7
 * Modalities  : A (EBR/EBA) — only modality published for this process
 *
 * Run (snapshot mode):  pnpm extract:unmsm:2025-I
 * Run (live mode):      pnpm extract:unmsm:2025-I -- --live
 */
import { fetchHtml, LIVE, sleep } from '../../../lib/http';
import { discoverModalities, discoverPrograms } from '../shared/discover-old';
import { parseOldFormatPage } from '../shared/parser-old';
import { writeCSV } from '../shared/csv';
import type { UNMSMRow } from '../shared/types';

const PROCESS_ID = '2025-I';
const BASE_URL = 'https://admision.unmsm.edu.pe/Website20251';
const SLUG = 'unmsm';
const SNAP = `${SLUG}/${PROCESS_ID}`;

async function main(): Promise<void> {
  console.log(`UNMSM ${PROCESS_ID} — ${LIVE ? 'live (overwriting snapshots)' : 'snapshot mode'}`);
  const scrapedAt = new Date().toISOString();

  const modalities = await discoverModalities(`${BASE_URL}/`, `${SNAP}/_root`);
  console.log(`Found modalities: ${modalities.map((m) => m.code).join(', ')}`);

  for (const mod of modalities) {
    console.log(`\nModality ${mod.code}: ${mod.label}`);

    const programs = await discoverPrograms(mod.url, `${SNAP}/${mod.code}/_index`);
    console.log(`  Discovered ${programs.length} programs`);

    const allRows: UNMSMRow[] = [];
    let skipped = 0;

    for (const prog of programs) {
      const snapshotKey = `${SNAP}/${mod.code}/${prog.code}`;
      try {
        const html = await fetchHtml(prog.url, snapshotKey);
        const rows = parseOldFormatPage(html, PROCESS_ID, mod.code, '', scrapedAt);
        allRows.push(...rows);
        if (LIVE) await sleep(300);
      } catch (err) {
        skipped++;
        console.warn(`  [skip] ${prog.code}: ${(err as Error).message}`);
      }
    }

    if (skipped > 0) console.warn(`  ${skipped} program(s) skipped`);

    allRows.sort((a, b) => {
      const prog = a.program_clean.localeCompare(b.program_clean, 'es');
      if (prog !== 0) return prog;
      if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
      if (a.rank !== null) return -1;
      if (b.rank !== null) return 1;
      return 0;
    });

    const admitted = allRows.filter((r) => r.admitted).length;
    console.log(`  Total rows: ${allRows.length.toLocaleString()} (${admitted.toLocaleString()} admitted)`);

    await writeCSV(allRows, SLUG, PROCESS_ID, mod.code);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
