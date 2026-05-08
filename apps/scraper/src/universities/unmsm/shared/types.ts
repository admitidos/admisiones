export type UNMSMModality =
  | 'A' // Educación Básica Regular (EBR) y Educación Básica Alternativa (EBA)
  | 'C' // Primeros Puestos de Educación Secundaria
  | 'D' // Traslado Interno
  | 'E' // Graduados o Titulados
  | 'F' // Traslado Externo Nacional
  | 'G' // Traslado Externo Internacional
  | 'H' // Deportista Calificado
  | 'I' // Deportistas Calificados de Alto Nivel
  | 'J' // Víctimas del Terrorismo
  | 'M' // Comunidades Nativas
  | 'N' // Personas con Discapacidad
  | 'O'; // Plan Integral de Reparaciones

export type UNMSMArea = 'A' | 'B' | 'C' | 'D' | 'E';

export interface UNMSMRow {
  process_id: string;
  modality: UNMSMModality;
  /** Applicant admission code as published in the portal. */
  code: string;
  /** Raw APELLIDOS Y NOMBRES — no normalization or splitting. */
  full_name: string;
  /** Exact program string from the portal, including any campus suffix. */
  program_raw: string;
  /** Program name with campus suffix removed. */
  program_clean: string;
  /** Campus extracted from program suffix (e.g. "CHILCA", "LIMA"). Empty string for main campus. */
  campus: string;
  /** Subject area (A–E). Empty string when not determinable from portal structure alone. */
  area: UNMSMArea | '';
  /** Final score. Null for absent applicants or when portal shows no value. */
  score: number | null;
  /** Merit rank within the program. Null for non-admitted and absent applicants. */
  rank: number | null;
  /** Raw observation string from the portal. Keep as-is — map to status enum at seed time. */
  observation: string;
  /** Whether the applicant was admitted. Derived from portal signals, not stored as user-facing status. */
  admitted: boolean;
  /** ISO 8601 UTC timestamp of the scrape run that produced this row. */
  scraped_at: string;
}
