import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Universities ──────────────────────────────────────────────────────────────

const UNIVERSITIES = [
  { name: "Universidad Nacional Mayor de San Marcos", shortName: "San Marcos", acronym: "UNMSM", location: "Lima", color: "#15803D", status: "active" },
  { name: "Universidad Nacional de Ingeniería", shortName: "Ingeniería", acronym: "UNI", location: "Lima", color: "#B45309", status: "coming_soon" },
  { name: "Universidad Nacional San Luis Gonzaga", shortName: "San Luis Gonzaga", acronym: "UNICA", location: "Ica", color: "#0369A1", status: "coming_soon" },
];

// ── UNMSM modalities ──────────────────────────────────────────────────────────
// Names sourced from types.ts (scraper); examType from regulation structure.

const UNMSM_MODALITIES = [
  { code: "A", name: "Educación Básica Regular", examType: "general" },
  { code: "C", name: "Primeros Puestos de Educación Secundaria", examType: "general" },
  { code: "D", name: "Traslado Interno", examType: "special" },
  { code: "E", name: "Graduados o Titulados", examType: "special" },
  { code: "F", name: "Traslado Externo Nacional", examType: "special" },
  { code: "G", name: "Traslado Externo Internacional", examType: "special" },
  { code: "H", name: "Deportista Calificado", examType: "special" },
  { code: "I", name: "Deportistas Calificados de Alto Nivel", examType: "special" },
  { code: "J", name: "Víctimas del Terrorismo", examType: "special" },
  { code: "M", name: "Comunidades Nativas", examType: "special" },
  { code: "N", name: "Personas con Discapacidad", examType: "special" },
  { code: "O", name: "Plan Integral de Reparaciones", examType: "special" },
];

// ── UNMSM process configs ─────────────────────────────────────────────────────
// Flags sourced from research YAML files in apps/scraper/src/universities/unmsm/research/.

type ExamDateConfig = {
  date: Date;
  area: string | null;
  examType: string;
  note: string | null;
};

type ProcessConfig = {
  slug: string;
  period: string;
  examYear: number;
  examSemester: string;
  unmsm: {
    isPartialProcess: boolean;
    hasAreas: boolean;
    hasMinScoreFilter: boolean;
    minScoreThreshold: number | null;
    hasSecondChoice: boolean;
  };
  examDates: ExamDateConfig[];
};

const UNMSM_PROCESSES: ProcessConfig[] = [
  {
    slug: "2024-1",
    period: "2024-I",
    examYear: 2024,
    examSemester: "I",
    unmsm: {
      isPartialProcess: true,
      hasAreas: true,
      hasMinScoreFilter: true,
      minScoreThreshold: 900,
      hasSecondChoice: true,
    },
    examDates: [
      { date: new Date("2023-12-02"), area: null, examType: "general", note: "Áreas D y E" },
      { date: new Date("2023-12-03"), area: null, examType: "general", note: "Áreas B y C" },
      { date: new Date("2023-12-09"), area: "A", examType: "general", note: "Excepto Medicina Humana" },
      { date: new Date("2023-12-10"), area: "A", examType: "general", note: "Medicina Humana únicamente" },
    ],
  },
  {
    slug: "2024-2",
    period: "2024-II",
    examYear: 2024,
    examSemester: "II",
    unmsm: {
      isPartialProcess: false,
      hasAreas: true,
      hasMinScoreFilter: true,
      minScoreThreshold: 900,
      hasSecondChoice: true,
    },
    examDates: [
      { date: new Date("2024-03-09"), area: null, examType: "general", note: "Áreas D y E" },
      { date: new Date("2024-03-10"), area: null, examType: "general", note: "Áreas B y C" },
      { date: new Date("2024-03-10"), area: null, examType: "special", note: "Todas las modalidades especiales" },
      { date: new Date("2024-03-16"), area: "A", examType: "general", note: "Excepto Medicina Humana" },
      { date: new Date("2024-03-17"), area: "A", examType: "general", note: "Medicina Humana únicamente" },
    ],
  },
  {
    slug: "2025-1",
    period: "2025-I",
    examYear: 2025,
    examSemester: "I",
    unmsm: {
      isPartialProcess: true,
      hasAreas: true,
      hasMinScoreFilter: false,
      minScoreThreshold: null,
      hasSecondChoice: false,
    },
    examDates: [
      { date: new Date("2024-10-05"), area: null, examType: "general", note: "Áreas D y E" },
      { date: new Date("2024-10-06"), area: null, examType: "general", note: "Áreas B y C" },
      { date: new Date("2024-10-12"), area: "A", examType: "general", note: "Excepto Medicina Humana" },
      { date: new Date("2024-10-13"), area: "A", examType: "general", note: "Medicina Humana únicamente" },
    ],
  },
  {
    slug: "2025-2",
    period: "2025-II",
    examYear: 2025,
    examSemester: "II",
    unmsm: {
      isPartialProcess: false,
      hasAreas: true,
      hasMinScoreFilter: false,
      minScoreThreshold: null,
      hasSecondChoice: false,
    },
    examDates: [
      { date: new Date("2025-03-01"), area: null, examType: "general", note: "Áreas D y E" },
      { date: new Date("2025-03-02"), area: null, examType: "general", note: "Áreas B y C" },
      { date: new Date("2025-03-02"), area: null, examType: "special", note: "Todas las modalidades especiales" },
      { date: new Date("2025-03-08"), area: "A", examType: "general", note: "Excepto Medicina Humana" },
      { date: new Date("2025-03-09"), area: "A", examType: "general", note: "Medicina Humana únicamente" },
    ],
  },
  {
    slug: "2026-1",
    period: "2026-I",
    examYear: 2026,
    examSemester: "I",
    unmsm: {
      isPartialProcess: true,
      hasAreas: true,
      hasMinScoreFilter: false,
      minScoreThreshold: null,
      hasSecondChoice: false,
    },
    examDates: [
      { date: new Date("2025-09-13"), area: null, examType: "general", note: "Áreas D y E" },
      { date: new Date("2025-09-14"), area: null, examType: "general", note: "Áreas B y C" },
      { date: new Date("2025-09-20"), area: "A", examType: "general", note: "Excepto Medicina Humana" },
      { date: new Date("2025-09-21"), area: "A", examType: "general", note: "Medicina Humana únicamente" },
    ],
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────

async function main() {
  // Universities
  for (const u of UNIVERSITIES) {
    await prisma.university.upsert({
      where: { acronym: u.acronym },
      update: u,
      create: u,
    });
  }
  console.log(`✓ ${UNIVERSITIES.length} universities`);

  const unmsm = await prisma.university.findUniqueOrThrow({ where: { acronym: "UNMSM" } });

  // UNMSM modalities
  for (const m of UNMSM_MODALITIES) {
    await prisma.unmsmModality.upsert({
      where: { code: m.code },
      update: m,
      create: m,
    });
  }
  console.log(`✓ ${UNMSM_MODALITIES.length} UNMSM modalities`);

  // Processes + UnmsmProcess + ExamDates
  for (const config of UNMSM_PROCESSES) {
    const process = await prisma.process.upsert({
      where: { universityId_slug: { universityId: unmsm.id, slug: config.slug } },
      update: {
        period: config.period,
        examYear: config.examYear,
        examSemester: config.examSemester,
      },
      create: {
        universityId: unmsm.id,
        slug: config.slug,
        period: config.period,
        examYear: config.examYear,
        examSemester: config.examSemester,
      },
    });

    await prisma.unmsmProcess.upsert({
      where: { processId: process.id },
      update: config.unmsm,
      create: { processId: process.id, ...config.unmsm },
    });

    // Delete + recreate exam dates (no FK references to them, safe to wipe)
    await prisma.examDate.deleteMany({ where: { processId: process.id } });
    await prisma.examDate.createMany({
      data: config.examDates.map((d) => ({ processId: process.id, ...d })),
    });
  }
  console.log(`✓ ${UNMSM_PROCESSES.length} UNMSM processes with exam dates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
