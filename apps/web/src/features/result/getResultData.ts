import { prisma } from "@admitidos/db";
import { filter, map, pipe, sortBy } from "remeda";
import { formatTendency, type Tendency } from "@/lib/utils/formatters";

export type ApplicantStatus = "admitted" | "not_admitted" | "absent" | "disqualified";

export interface ReachableProgram {
  id: string;
  name: string;
  campus: string;
  area: string | null;
  cutoffScore: number;
  pointsDiff: number;
  crossArea: boolean;
}

export interface HistoricalCutoff {
  period: string;
  cutoffScore: number;
  admissionRate: number;
}

export interface ResultData {
  applicant: { code: string; fullName: string };
  result: {
    score: number;
    rank: number | null;
    status: ApplicantStatus;
    observation: string;
  };
  program: { name: string; area: string | null; campus: string };
  modality: { code: string; name: string };
  process: { period: string; slug: string };
  university: { acronym: string; name: string; color: string };
  computed: {
    pointsToAdmission: number;
    percentileInProgram: number;
    percentileInArea: number;
    cutoffScore: number | null;
    totalApplicants: number;
    totalAdmitted: number;
    admissionRate: number | null;
    reachablePrograms: ReachableProgram[];
    historicalCutoffs: HistoricalCutoff[];
    cutoffTendency: Tendency;
    scoreDistribution: number[];
  };
}

// Fraction of scores at or below `score` — 0.985 means "top 1.5%".
const percentileAtOrBelow = (scores: number[], score: number): number =>
  scores.length === 0 ? 0 : filter(scores, (s) => s <= score).length / scores.length;

export interface GetResultDataInput {
  universityAcronym: string;
  processSlug: string;
  applicantCode: string;
}

export async function getResultData({
  universityAcronym,
  processSlug,
  applicantCode,
}: GetResultDataInput): Promise<ResultData | null> {
  const university = await prisma.university.findUnique({
    where: { acronym: universityAcronym.toUpperCase() },
  });
  if (!university) return null;

  const process = await prisma.process.findUnique({
    where: { universityId_slug: { universityId: university.id, slug: processSlug } },
  });
  if (!process) return null;

  const applicant = await prisma.unmsmApplicant.findFirst({
    where: { processId: process.id, code: applicantCode },
    include: {
      result: true,
      modality: { select: { code: true, name: true } },
      program: { include: { career: { select: { name: true, area: true } } } },
    },
  });
  if (!applicant || !applicant.result) return null;

  const { result, program, modality } = applicant;
  const score = result.score;
  const area = program.career.area;
  const cutoffScore = program.cutoffScore;

  // Score distributions — program drives both the chart and the in-program percentile;
  // área scores power the cross-área percentile. Select only `score` to keep payloads small.
  const [programScoreRows, areaScoreRows] = await Promise.all([
    prisma.unmsmResult.findMany({
      where: { applicant: { programId: program.id } },
      select: { score: true },
    }),
    area
      ? prisma.unmsmResult.findMany({
          where: { applicant: { processId: process.id, program: { career: { area } } } },
          select: { score: true },
        })
      : Promise.resolve([] as { score: number }[]),
  ]);

  const scoreDistribution = pipe(
    programScoreRows,
    map((r) => r.score),
    sortBy((s) => s),
  );
  const areaScores = area ? map(areaScoreRows, (r) => r.score) : scoreDistribution;

  // Other programs in this process whose cutoff the applicant's score clears.
  const reachableRows = await prisma.program.findMany({
    where: {
      processId: process.id,
      id: { not: program.id },
      cutoffScore: { lte: score },
    },
    include: { career: { select: { name: true, area: true } } },
    orderBy: { cutoffScore: "desc" },
  });
  const reachablePrograms: ReachableProgram[] = map(reachableRows, (p) => ({
    id: String(p.id),
    name: p.career.name,
    campus: p.campus,
    area: p.career.area,
    cutoffScore: p.cutoffScore ?? 0,
    pointsDiff: score - (p.cutoffScore ?? 0),
    crossArea: p.career.area !== area,
  }));

  // Same career + campus across every process — the cutoff trend chart.
  const historyRows = await prisma.program.findMany({
    where: { careerId: program.careerId, campus: program.campus, cutoffScore: { not: null } },
    include: { process: { select: { period: true, examYear: true, examSemester: true } } },
  });
  const historicalCutoffs: HistoricalCutoff[] = pipe(
    historyRows,
    sortBy(
      (p) => p.process.examYear,
      (p) => p.process.examSemester,
    ),
    map((p) => ({
      period: p.process.period,
      cutoffScore: p.cutoffScore ?? 0,
      admissionRate: p.admissionRate ?? 0,
    })),
  );

  return {
    applicant: { code: applicant.code, fullName: applicant.fullName },
    result: {
      score,
      rank: result.rank,
      status: result.status as ApplicantStatus,
      observation: result.observation,
    },
    program: { name: program.career.name, area, campus: program.campus },
    modality: { code: modality.code, name: modality.name },
    process: { period: process.period, slug: process.slug },
    university: { acronym: university.acronym, name: university.name, color: university.color },
    computed: {
      pointsToAdmission: cutoffScore === null ? 0 : score - cutoffScore,
      percentileInProgram: percentileAtOrBelow(scoreDistribution, score),
      percentileInArea: percentileAtOrBelow(areaScores, score),
      cutoffScore,
      totalApplicants: program.totalApplicants ?? 0,
      totalAdmitted: program.totalAdmitted ?? 0,
      admissionRate: program.admissionRate,
      reachablePrograms,
      historicalCutoffs,
      cutoffTendency: formatTendency(map(historicalCutoffs, (h) => h.cutoffScore)),
      scoreDistribution,
    },
  };
}
