/**
 * Parser for the old portal format (2024-I through 2025-II).
 *
 * Data layout: all values are plain text in <td> cells.
 * Non-blank cells that carry no value use &nbsp; ( ) rather than an empty string.
 *
 * Column order: CODIGO | APELLIDOS Y NOMBRES | ESCUELA PROFESIONAL | PUNTAJE | MERITO E.P | OBSERVACIÓN
 *
 * Admitted detection: rank column is a number AND observation === 'ALCANZO VACANTE'.
 * (2026-I switched to 'ALCANZÓ VACANTE' — the new-format parser handles that separately.)
 */
import { load } from 'cheerio';
import { extractCampus } from './campus';
import type { UNMSMArea, UNMSMModality, UNMSMRow } from './types';

/** Strips &nbsp; and surrounding whitespace. Returns empty string for blank cells. */
function cell(raw: string): string {
  return raw.replace(/ /g, '').trim();
}

export function parseOldFormatPage(
  html: string,
  processId: string,
  modality: UNMSMModality,
  /** Pass 'A' when the portal name makes it unambiguous (Website20252GeneralA). Otherwise ''. */
  area: UNMSMArea | '',
  scrapedAt: string,
): UNMSMRow[] {
  const $ = load(html);
  const rows: UNMSMRow[] = [];

  // 2024-I uses id="tabla"; all later processes use id="tablaPostulantes"
  const table = $('#tablaPostulantes').length ? $('#tablaPostulantes') : $('#tabla');
  if (table.length === 0) return rows;

  table.find('tbody tr').each((_, tr) => {
    const $tds = $(tr).find('td');
    if ($tds.length < 6) return;

    const code = cell($tds.eq(0).text());
    if (!code) return;

    const fullName = cell($tds.eq(1).text());
    const programRaw = cell($tds.eq(2).text());
    const scoreText = cell($tds.eq(3).text());
    const rankText = cell($tds.eq(4).text());
    const observation = cell($tds.eq(5).text());

    const scoreParsed = scoreText ? parseFloat(scoreText) : NaN;
    const rankParsed = rankText ? parseInt(rankText, 10) : NaN;

    const score = isNaN(scoreParsed) ? null : scoreParsed;
    const rank = isNaN(rankParsed) ? null : rankParsed;
    // 2024-II introduced "ALCANZO VACANTE PRIMERA OPCIÓN" and "ALCANZO VACANTE SEGUNDA OPCIÓN"
    // (segunda opción mechanism). Use startsWith to capture all admission variants.
    const admitted = rank !== null && observation.startsWith('ALCANZO VACANTE');

    const { clean: programClean, campus } = extractCampus(programRaw);

    rows.push({
      process_id: processId,
      modality,
      code,
      full_name: fullName,
      program_raw: programRaw,
      program_clean: programClean,
      campus,
      area,
      score,
      rank,
      observation,
      admitted,
      scraped_at: scrapedAt,
    });
  });

  return rows;
}
