import { unstable_cache } from "next/cache";
import { prisma } from "@admitidos/db";
import type { ApplicantStatus } from "@/features/result/getResultData";

// Past admission data is immutable, so cache reads for a day to avoid re-querying Neon on
// every navigation. `unstable_cache` keys on the stringified arguments (incl. pagination
// + search query for the applicant list), so each distinct call is cached independently.
const ONE_DAY = 86400;

export type Area = "A" | "B" | "C" | "D" | "E";

export interface ProcessProgram {
  id: string;
  name: string;
  campus: string;
  area: Area | null;
  vacancies: number | null;
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

export interface ProcessData {
  university: { acronym: string; name: string; color: string };
  process: { period: string; slug: string };
  stats: {
    totalApplicants: number;
    totalVacancies: number;
    programCount: number;
    admissionRate: number;
  };
  programs: ProcessProgram[];
}

export interface ProgramData {
  university: { acronym: string; name: string; color: string };
  process: { period: string; slug: string };
  program: ProcessProgram;
}

export interface PaginatedApplicants {
  applicants: ProcessApplicant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: string;
}

// A Prisma program row with its career joined — mapped to the UI ProcessProgram.
type ProgramRow = {
  id: number;
  campus: string;
  vacancies: number | null;
  cutoffScore: number | null;
  totalApplicants: number | null;
  totalAdmitted: number | null;
  admissionRate: number | null;
  career: { name: string; area: string | null };
};

const toProcessProgram = (p: ProgramRow): ProcessProgram => ({
  id: String(p.id),
  name: p.career.name,
  campus: p.campus,
  area: (p.career.area as Area | null) ?? null,
  vacancies: p.vacancies,
  cutoffScore: p.cutoffScore,
  totalApplicants: p.totalApplicants ?? 0,
  totalAdmitted: p.totalAdmitted ?? 0,
  admissionRate: p.admissionRate,
});

export interface GetProcessDataInput {
  universityAcronym: string;
  processSlug: string;
}

async function getProcessDataUncached({
  universityAcronym,
  processSlug,
}: GetProcessDataInput): Promise<ProcessData | null> {
  const university = await prisma.university.findUnique({
    where: { acronym: universityAcronym.toUpperCase() },
  });
  if (!university) return null;

  const process = await prisma.process.findUnique({
    where: { universityId_slug: { universityId: university.id, slug: processSlug } },
  });
  if (!process) return null;

  const programs = await prisma.program.findMany({
    where: { processId: process.id },
    include: { career: { select: { name: true, area: true } } },
    orderBy: [{ career: { area: "asc" } }, { career: { name: "asc" } }],
  });

  const totalApplicants = process.totalApplicants ?? 0;
  const totalAdmitted = process.totalAdmitted ?? 0;
  const totalVacancies = programs.reduce((sum, p) => sum + (p.vacancies ?? 0), 0);

  return {
    university: { acronym: university.acronym, name: university.name, color: university.color },
    process: { period: process.period, slug: process.slug },
    stats: {
      totalApplicants,
      totalVacancies,
      programCount: programs.length,
      admissionRate: totalApplicants > 0 ? totalAdmitted / totalApplicants : 0,
    },
    programs: programs.map(toProcessProgram),
  };
}

export const getProcessData = unstable_cache(getProcessDataUncached, ["process-data"], {
  revalidate: ONE_DAY,
  tags: ["process-data"],
});

export interface GetProgramDataInput {
  universityAcronym: string;
  processSlug: string;
  programId: string;
}

async function getProgramDataUncached({
  universityAcronym,
  processSlug,
  programId,
}: GetProgramDataInput): Promise<ProgramData | null> {
  const id = Number(programId);
  if (!Number.isInteger(id)) return null;

  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      career: { select: { name: true, area: true } },
      process: { include: { university: true } },
    },
  });
  if (!program) return null;

  // Guard: the URL's university + process must match this program.
  const { process } = program;
  if (
    process.slug !== processSlug ||
    process.university.acronym.toLowerCase() !== universityAcronym.toLowerCase()
  ) {
    return null;
  }

  return {
    university: {
      acronym: process.university.acronym,
      name: process.university.name,
      color: process.university.color,
    },
    process: { period: process.period, slug: process.slug },
    program: toProcessProgram(program),
  };
}

export const getProgramData = unstable_cache(getProgramDataUncached, ["program-data"], {
  revalidate: ONE_DAY,
  tags: ["program-data"],
});

export interface GetProgramApplicantsInput {
  programId: string;
  page?: number;
  pageSize?: number;
  query?: string;
}

async function getProgramApplicantsUncached({
  programId,
  page = 1,
  pageSize = 50,
  query = "",
}: GetProgramApplicantsInput): Promise<PaginatedApplicants> {
  const id = Number(programId);
  const q = query.trim();
  const safePage = Math.max(1, Math.floor(page));

  const where = {
    programId: id,
    ...(q
      ? {
          OR: [
            { code: { contains: q } },
            { fullName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.unmsmApplicant.count({ where }),
    prisma.unmsmApplicant.findMany({
      where,
      include: { result: { select: { score: true, rank: true, status: true } } },
      // Merit order: ranked applicants first (by rank), then the rest by score.
      orderBy: [{ result: { rank: "asc" } }, { result: { score: "desc" } }],
      skip: (safePage - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    applicants: rows.map((a) => ({
      code: a.code,
      fullName: a.fullName,
      score: a.result?.score ?? 0,
      rank: a.result?.rank ?? null,
      status: (a.result?.status ?? "not_admitted") as ApplicantStatus,
    })),
    total,
    page: safePage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    query: q,
  };
}

export const getProgramApplicants = unstable_cache(
  getProgramApplicantsUncached,
  ["program-applicants"],
  { revalidate: ONE_DAY, tags: ["program-applicants"] },
);
