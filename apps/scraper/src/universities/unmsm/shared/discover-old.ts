/**
 * Discovery helpers for old-format portals (2024-I through 2025-II).
 *
 * Navigation hierarchy:
 *   root/            ← lists modality links: A.html, C.html, D.html…
 *   [MOD].html       ← lists program links: ./[MOD]/[CODE]/0.html
 *   [MOD]/[CODE]/0.html  ← full applicant table (DataTables client-side)
 */
import { load } from 'cheerio';
import { fetchHtml } from '../../../lib/http';
import type { UNMSMModality } from './types';

export interface ModalityLink {
  code: UNMSMModality;
  label: string;
  url: string;
}

export interface ProgramLink {
  code: string;
  label: string;
  url: string;
}

/**
 * Fetches the process root page and returns all modality links found.
 * Matches href values of the form "[UPPERCASE_LETTER].html".
 */
export async function discoverModalities(
  rootUrl: string,
  snapshotKey: string,
): Promise<ModalityLink[]> {
  const html = await fetchHtml(rootUrl, snapshotKey);
  const $ = load(html);
  const results: ModalityLink[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const match = href.match(/^([A-Z])\.html$/);
    if (!match) return;

    const code = match[1] as UNMSMModality;
    const label = $(el).text().trim();
    const url = new URL(href, rootUrl).toString();
    results.push({ code, label, url });
  });

  return results;
}

/**
 * Fetches a modality index page and returns all program links found.
 * Matches href values ending in /[CODE]/0.html.
 */
export async function discoverPrograms(
  modalityUrl: string,
  snapshotKey: string,
): Promise<ProgramLink[]> {
  const html = await fetchHtml(modalityUrl, snapshotKey);
  const $ = load(html);
  const results: ProgramLink[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const match = href.match(/([^/]+)\/0\.html$/);
    if (!match) return;

    const code = match[1] as string;
    const label = $(el).text().trim();
    const url = new URL(href, modalityUrl).toString();
    results.push({ code, label, url });
  });

  return results;
}
