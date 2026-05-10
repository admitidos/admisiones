import type { ApplicantStatus, AdmissionOption } from "@admitidos/db";
import { NAME_NORMALIZATIONS } from "./constants";

export function normalizeCareerName(raw: string): string {
  const trimmed = raw.trim();
  return NAME_NORMALIZATIONS[trimmed] ?? trimmed;
}

export function normalizeCampus(campus: string): string {
  return campus.trim() || "LIMA";
}

export function deriveStatus(observation: string): ApplicantStatus {
  const obs = observation.trim().toUpperCase();
  if (obs === "AUSENTE") return "absent";
  if (obs === "ANULADO") return "disqualified";
  if (obs.startsWith("ALCANZO") || obs.startsWith("ALCANZÓ")) return "admitted";
  return "not_admitted";
}

export function deriveAdmissionOption(observation: string): AdmissionOption | null {
  const obs = observation.trim().toUpperCase();
  if (obs.includes("PRIMERA")) return "first";
  if (obs.includes("SEGUNDA")) return "second";
  return null;
}
