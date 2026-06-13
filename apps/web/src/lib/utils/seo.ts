import type { Metadata } from "next";
import { formatScore } from "./formatters";

interface ResultMetaInput {
  fullName: string;
  score: number;
  programName: string;
  universityAcronym: string;
  processPeriod: string;
  admitted: boolean;
}

interface ProcessMetaInput {
  universityAcronym: string;
  processPeriod: string;
  programCount: number;
}

export const buildResultMetadata = ({
  fullName,
  score,
  programName,
  universityAcronym,
  processPeriod,
  admitted,
}: ResultMetaInput): Metadata => {
  const status = admitted ? "Ingresó" : "No ingresó";
  const title = `${fullName} — ${formatScore(score)} pts — ${programName}`;
  const description = `${status} a ${programName} en ${universityAcronym} ${processPeriod}. Puntaje: ${formatScore(score)} puntos. Consulta el contexto completo en admitidos.pe`;

  return {
    title,
    description,
    openGraph: {
      title: `${status}: ${fullName} · ${universityAcronym} ${processPeriod}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export const buildProcessMetadata = ({
  universityAcronym,
  processPeriod,
  programCount,
}: ProcessMetaInput): Metadata => {
  const title = `${universityAcronym} ${processPeriod} — Resultados por carrera`;
  const description = `${programCount} carreras con resultados publicados. Encuentra tu nombre, puntaje de corte y estadísticas por programa.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
};
