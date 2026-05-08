/**
 * Parser for the 2026-I+ portal format.
 *
 * Key differences from the old format:
 *  - Names and program names are Base64-encoded in <span data-auth="...">
 *  - Score lives in <td data-score="738.750">, not in td text
 *  - Rank lives in <td data-merit="12">, not in td text
 *  - Admitted rows carry class="table-success" on the <tr>
 *  - Observation is still plain <td> text (may be empty)
 */
import { load } from 'cheerio';
import { extractCampus } from './campus';
import type { UNMSMModality, UNMSMRow } from './types';

function decodeAuth(encoded: string | undefined): string {
  if (!encoded) return '';
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

function parseScore(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function parseRank(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

export function parseNewFormatPage(
  html: string,
  processId: string,
  modality: UNMSMModality,
  scrapedAt: string,
): UNMSMRow[] {
  const $ = load(html);
  const rows: UNMSMRow[] = [];

  const table = $('#tablaPostulantes');
  if (table.length === 0) return rows;

  table.find('tbody tr').each((_, tr) => {
    const $tr = $(tr);
    const $tds = $tr.find('td');
    if ($tds.length < 6) return;

    const code = $tds.eq(0).text().trim();
    if (!code) return;

    const fullName = decodeAuth($tds.eq(1).find('.obfuscated').attr('data-auth'));
    const programRaw = decodeAuth($tds.eq(2).find('.obfuscated').attr('data-auth'));
    const score = parseScore($tds.eq(3).attr('data-score'));
    const rank = parseRank($tds.eq(4).attr('data-merit'));
    const observation = $tds.eq(5).text().trim();
    const admitted = $tr.hasClass('table-success');

    const { clean: programClean, campus } = extractCampus(programRaw);

    rows.push({
      process_id: processId,
      modality,
      code,
      full_name: fullName,
      program_raw: programRaw,
      program_clean: programClean,
      campus,
      area: '',
      score,
      rank,
      observation,
      admitted,
      scraped_at: scrapedAt,
    });
  });

  return rows;
}
