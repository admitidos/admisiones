import { pipe, sortBy } from "remeda";
import type { ApplicantStatus } from "@/features/result/getResultData";

export type Area = "A" | "B" | "C" | "D" | "E";

export interface ProcessProgram {
  id: string;
  name: string;
  campus: string;
  area: Area | null;
  modalityCode: string;
  modalityName: string;
  vacancies: number;
  cutoffScore: number | null;
  totalApplicants: number;
  totalAdmitted: number;
  admissionRate: number | null;
}

export interface ProcessApplicant {
  code: string;
  fullName: string;
  score: number;
  rank: number | null;
  status: ApplicantStatus;
}

export interface ProcessProgramWithApplicants extends ProcessProgram {
  applicants: ProcessApplicant[];
}

export interface ProcessData {
  university: { acronym: string; name: string; color: string };
  process: { period: string; slug: string };
  stats: {
    totalApplicants: number;
    totalVacancies: number;
    programCount: number;
    admissionRate: number;
  };
  modalities: { code: string; name: string }[];
  programs: ProcessProgramWithApplicants[];
}

const UNMSM_COLOR = "#1c6b3a";

const makeApplicants = (
  count: number,
  cutoff: number | null,
  baseScore: number,
): ProcessApplicant[] =>
  Array.from({ length: count }, (_, i) => {
    const score = Math.round(baseScore - i * (baseScore * 0.0025));
    const admitted = cutoff !== null && score >= cutoff;
    return {
      code: String(100010 + i).padStart(6, "0"),
      fullName: MOCK_NAMES[i % MOCK_NAMES.length],
      score,
      rank: admitted ? i + 1 : null,
      status: admitted ? "admitted" : "not_admitted",
    };
  });

const MOCK_NAMES = [
  "García López, Ana María",
  "Quispe Mamani, Carlos Enrique",
  "Rodríguez Torres, Lucía Fernanda",
  "Flores Huanca, José Manuel",
  "Mamani Condori, Rosa Elena",
  "Torres Vega, Diego Alejandro",
  "López Herrera, Sofía Isabel",
  "Chávez Reyes, Andrés Eduardo",
  "Huanca Quispe, María del Carmen",
  "Vargas Salinas, Pablo Antonio",
  "Condori Mamani, Claudia Beatriz",
  "Reyes Castro, Ricardo Javier",
];

const PROGRAMS: Omit<ProcessProgramWithApplicants, "applicants">[] = [
  { id: "prog-medicina", name: "Medicina Humana", campus: "Lima", area: "A", modalityCode: "A", modalityName: "EBR", vacancies: 60, cutoffScore: 1255, totalApplicants: 2847, totalAdmitted: 60, admissionRate: 0.021 },
  { id: "prog-farmacia", name: "Farmacia y Bioquímica", campus: "Lima", area: "A", modalityCode: "A", modalityName: "EBR", vacancies: 45, cutoffScore: 1310, totalApplicants: 1204, totalAdmitted: 45, admissionRate: 0.037 },
  { id: "prog-enfermeria", name: "Enfermería", campus: "Lima", area: "A", modalityCode: "A", modalityName: "EBR", vacancies: 55, cutoffScore: 1290, totalApplicants: 980, totalAdmitted: 55, admissionRate: 0.056 },
  { id: "prog-biologia", name: "Biología", campus: "Lima", area: "A", modalityCode: "A", modalityName: "EBR", vacancies: 40, cutoffScore: 1260, totalApplicants: 742, totalAdmitted: 40, admissionRate: 0.054 },
  { id: "prog-nutricion", name: "Nutrición", campus: "Lima", area: "A", modalityCode: "A", modalityName: "EBR", vacancies: 35, cutoffScore: 1195, totalApplicants: 614, totalAdmitted: 35, admissionRate: 0.057 },
  { id: "prog-quimica", name: "Química", campus: "Lima", area: "B", modalityCode: "A", modalityName: "EBR", vacancies: 30, cutoffScore: 1120, totalApplicants: 480, totalAdmitted: 30, admissionRate: 0.063 },
  { id: "prog-fisica", name: "Física", campus: "Lima", area: "B", modalityCode: "A", modalityName: "EBR", vacancies: 28, cutoffScore: 1100, totalApplicants: 396, totalAdmitted: 28, admissionRate: 0.071 },
  { id: "prog-matematica", name: "Matemática", campus: "Lima", area: "B", modalityCode: "A", modalityName: "EBR", vacancies: 32, cutoffScore: 1085, totalApplicants: 408, totalAdmitted: 32, admissionRate: 0.078 },
  { id: "prog-civil", name: "Ingeniería Civil", campus: "Lima", area: "C", modalityCode: "A", modalityName: "EBR", vacancies: 50, cutoffScore: 1180, totalApplicants: 1580, totalAdmitted: 50, admissionRate: 0.032 },
  { id: "prog-sistemas", name: "Ingeniería de Sistemas", campus: "Lima", area: "C", modalityCode: "A", modalityName: "EBR", vacancies: 48, cutoffScore: 1165, totalApplicants: 1320, totalAdmitted: 48, admissionRate: 0.036 },
  { id: "prog-industrial", name: "Ingeniería Industrial", campus: "Lima", area: "C", modalityCode: "A", modalityName: "EBR", vacancies: 46, cutoffScore: 1152, totalApplicants: 1150, totalAdmitted: 46, admissionRate: 0.040 },
  { id: "prog-economia", name: "Economía", campus: "Lima", area: "D", modalityCode: "A", modalityName: "EBR", vacancies: 55, cutoffScore: 1130, totalApplicants: 980, totalAdmitted: 55, admissionRate: 0.056 },
  { id: "prog-contabilidad", name: "Contabilidad", campus: "Lima", area: "D", modalityCode: "A", modalityName: "EBR", vacancies: 60, cutoffScore: 1090, totalApplicants: 870, totalAdmitted: 60, admissionRate: 0.069 },
  { id: "prog-administracion", name: "Administración de Empresas", campus: "Lima", area: "D", modalityCode: "A", modalityName: "EBR", vacancies: 55, cutoffScore: 1095, totalApplicants: 920, totalAdmitted: 55, admissionRate: 0.060 },
  { id: "prog-derecho", name: "Derecho", campus: "Lima", area: "E", modalityCode: "A", modalityName: "EBR", vacancies: 65, cutoffScore: 1148, totalApplicants: 1620, totalAdmitted: 65, admissionRate: 0.040 },
  { id: "prog-comunicacion", name: "Comunicación Social", campus: "Lima", area: "E", modalityCode: "A", modalityName: "EBR", vacancies: 45, cutoffScore: 1112, totalApplicants: 820, totalAdmitted: 45, admissionRate: 0.055 },
  { id: "prog-literatura", name: "Literatura", campus: "Lima", area: "E", modalityCode: "A", modalityName: "EBR", vacancies: 30, cutoffScore: 1080, totalApplicants: 510, totalAdmitted: 30, admissionRate: 0.059 },
];

const MOCK_PROCESS_DATA: ProcessData = {
  university: {
    acronym: "UNMSM",
    name: "Universidad Nacional Mayor de San Marcos",
    color: UNMSM_COLOR,
  },
  process: { period: "2026-I", slug: "2026-1" },
  stats: {
    totalApplicants: 26507,
    totalVacancies: 2561,
    programCount: PROGRAMS.length,
    admissionRate: 0.097,
  },
  modalities: [
    { code: "A", name: "Educación Básica Regular (EBR)" },
    { code: "C", name: "Deportistas Calificados" },
    { code: "D", name: "Traslado Externo" },
  ],
  programs: pipe(
    PROGRAMS,
    sortBy((p) => [p.area ?? "Z", p.name]),
  ).map((p) => ({
    ...p,
    applicants: makeApplicants(Math.min(p.totalApplicants, 50), p.cutoffScore, p.cutoffScore ? p.cutoffScore + 200 : 1200),
  })),
};

export interface GetProcessDataInput {
  universityAcronym: string;
  processSlug: string;
}

export async function getProcessData({
  universityAcronym,
  processSlug,
}: GetProcessDataInput): Promise<ProcessData | null> {
  if (universityAcronym.toUpperCase() === "UNMSM" && processSlug === "2026-1") {
    return MOCK_PROCESS_DATA;
  }
  return null;
}
