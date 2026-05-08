/**
 * UNMSM 2025-II extractor
 *
 * This process was published across THREE separate portal roots — an anomaly unique to 2025-II.
 * See README.md § "2025-II portal split" for context.
 *
 * Portal A  (EBR/EBA — Area A only):    Website20252GeneralA/
 * Portal B  (EBR/EBA — Areas B–E):      Website20252General/
 * Portal C  (Special modalities D/E/F/G): Website20252Especial/
 *
 * Both Portal A and Portal B produce rows for modality "A" (EBR/EBA). They are merged into
 * a single A.csv. Area is set to 'A' for Portal A rows; left empty for Portal B rows
 * (area must be resolved from program code at seed time).
 *
 * Run (snapshot mode):  pnpm extract:unmsm:2025-II
 * Run (live mode):      pnpm extract:unmsm:2025-II -- --live
 */
import { fetchHtml, LIVE, sleep } from '../../../lib/http';
import { discoverModalities, discoverPrograms } from '../shared/discover-old';
import { parseOldFormatPage } from '../shared/parser-old';
import { writeCSV } from '../shared/csv';
import type { UNMSMArea, UNMSMRow } from '../shared/types';

const PROCESS_ID = '2025-II';
const SLUG = 'unmsm';
const SNAP = `${SLUG}/${PROCESS_ID}`;

const PORTAL_GENERAL_A = 'https://admision.unmsm.edu.pe/Website20252GeneralA';
const PORTAL_GENERAL = 'https://admision.unmsm.edu.pe/Website20252General';
const PORTAL_ESPECIAL = 'https://admision.unmsm.edu.pe/Website20252Especial';

function sortRows(rows: UNMSMRow[]): void {
  rows.sort((a, b) => {
    const prog = a.program_clean.localeCompare(b.program_clean, 'es');
    if (prog !== 0) return prog;
    if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
    if (a.rank !== null) return -1;
    if (b.rank !== null) return 1;
    return 0;
  });
}

async function scrapePortal(
  portalUrl: string,
  snapPrefix: string,
  area: UNMSMArea | '',
  scrapedAt: string,
): Promise<UNMSMRow[]> {
  const modalities = await discoverModalities(`${portalUrl}/`, `${snapPrefix}/_root`);

  const allRows: UNMSMRow[] = [];

  for (const mod of modalities) {
    console.log(`  Modality ${mod.code}: ${mod.label}`);
    const programs = await discoverPrograms(mod.url, `${snapPrefix}/${mod.code}/_index`);
    console.log(`    Discovered ${programs.length} programs`);

    let skipped = 0;
    for (const prog of programs) {
      const snapshotKey = `${snapPrefix}/${mod.code}/${prog.code}`;
      try {
        const html = await fetchHtml(prog.url, snapshotKey);
        const rows = parseOldFormatPage(html, PROCESS_ID, mod.code, area, scrapedAt);
        allRows.push(...rows);
        if (LIVE) await sleep(300);
      } catch (err) {
        skipped++;
        console.warn(`    [skip] ${prog.code}: ${(err as Error).message}`);
      }
    }
    if (skipped > 0) console.warn(`    ${skipped} program(s) skipped`);
  }

  return allRows;
}

async function main(): Promise<void> {
  console.log(`UNMSM ${PROCESS_ID} — ${LIVE ? 'live (overwriting snapshots)' : 'snapshot mode'}`);
  const scrapedAt = new Date().toISOString();

  // ── General portals: both contain modalities A, C, J, M, N, O ────────────
  // GeneralA = Area A programs; General = Areas B–E programs.
  // Merge by modality and write one CSV per modality code.
  console.log('\nPortal GeneralA (Area A — modalities A/C/J/M/N/O):');
  const rowsGeneralA = await scrapePortal(PORTAL_GENERAL_A, `${SNAP}/GeneralA`, 'A', scrapedAt);

  console.log('\nPortal General (Areas B–E — modalities A/C/J/M/N/O):');
  const rowsGeneral = await scrapePortal(PORTAL_GENERAL, `${SNAP}/General`, '', scrapedAt);

  const byModality = new Map<string, UNMSMRow[]>();
  for (const row of [...rowsGeneralA, ...rowsGeneral]) {
    const bucket = byModality.get(row.modality) ?? [];
    bucket.push(row);
    byModality.set(row.modality, bucket);
  }
  console.log('');
  for (const [modCode, rows] of byModality) {
    sortRows(rows);
    const admitted = rows.filter((r) => r.admitted).length;
    console.log(`Modality ${modCode}: ${rows.length.toLocaleString()} rows (${admitted.toLocaleString()} admitted)`);
    await writeCSV(rows, SLUG, PROCESS_ID, modCode);
  }

  // ── Especial portal: modalities D, E, F, G ─────────────────────────────────
  console.log('\nPortal Especial (modalities D/E/F/G):');

  const especialMods = await discoverModalities(`${PORTAL_ESPECIAL}/`, `${SNAP}/Especial/_root`);
  console.log(`  Found modalities: ${especialMods.map((m) => m.code).join(', ')}`);

  for (const mod of especialMods) {
    console.log(`\n  Modality ${mod.code}: ${mod.label}`);
    const programs = await discoverPrograms(mod.url, `${SNAP}/Especial/${mod.code}/_index`);
    console.log(`    Discovered ${programs.length} programs`);

    const allRows: UNMSMRow[] = [];
    let skipped = 0;

    for (const prog of programs) {
      const snapshotKey = `${SNAP}/Especial/${mod.code}/${prog.code}`;
      try {
        const html = await fetchHtml(prog.url, snapshotKey);
        const rows = parseOldFormatPage(html, PROCESS_ID, mod.code, '', scrapedAt);
        allRows.push(...rows);
        if (LIVE) await sleep(300);
      } catch (err) {
        skipped++;
        console.warn(`    [skip] ${prog.code}: ${(err as Error).message}`);
      }
    }

    if (skipped > 0) console.warn(`    ${skipped} program(s) skipped`);
    sortRows(allRows);

    const admitted = allRows.filter((r) => r.admitted).length;
    console.log(`    Total rows: ${allRows.length.toLocaleString()} (${admitted.toLocaleString()} admitted)`);
    await writeCSV(allRows, SLUG, PROCESS_ID, mod.code);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
