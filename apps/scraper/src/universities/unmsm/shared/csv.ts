import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stringify } from 'csv-stringify/sync';
import { CSV_DIR } from '../../../lib/paths';
import type { UNMSMRow } from './types';

const COLUMNS: (keyof UNMSMRow)[] = [
  'process_id',
  'modality',
  'code',
  'full_name',
  'program_raw',
  'program_clean',
  'campus',
  'area',
  'score',
  'rank',
  'observation',
  'admitted',
  'scraped_at',
];

export async function writeCSV(
  rows: UNMSMRow[],
  universitySlug: string,
  processId: string,
  modalityCode: string,
): Promise<void> {
  const dir = path.join(CSV_DIR, universitySlug, processId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${modalityCode}.csv`);

  const csv = stringify(rows, {
    header: true,
    columns: COLUMNS.map((key) => ({ key, header: key })),
    cast: {
      boolean: (v) => (v ? 'true' : 'false'),
      object: (v) => (v === null ? '' : String(v)),
    },
  });

  await writeFile(filePath, csv, 'utf-8');
  console.log(`  Wrote ${rows.length.toLocaleString()} rows → ${path.relative(process.cwd(), filePath)}`);
}
