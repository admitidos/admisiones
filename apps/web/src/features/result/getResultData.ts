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

const UNMSM_COLOR = "#1c6b3a";

const MOCK_SCORE_DISTRIBUTION_ADMITTED: number[] = [
  900, 910, 920, 935, 940, 950, 955, 960, 965, 970, 975, 980, 985, 990, 995,
  1000, 1005, 1010, 1015, 1020, 1025, 1030, 1035, 1038, 1042, 1045, 1048,
  1052, 1055, 1058, 1060, 1062, 1065, 1068, 1070, 1072, 1075, 1078, 1080,
  1082, 1085, 1088, 1090, 1092, 1095, 1098, 1100, 1102, 1105, 1108, 1110,
  1112, 1115, 1118, 1120, 1122, 1125, 1128, 1130, 1132, 1135, 1138, 1140,
  1142, 1145, 1148, 1150, 1152, 1155, 1158, 1160, 1162, 1165, 1168, 1170,
  1172, 1175, 1178, 1180, 1182, 1185, 1188, 1190, 1192, 1195, 1198, 1200,
  1202, 1205, 1208, 1210, 1212, 1215, 1218, 1220, 1222, 1225, 1228, 1230,
  1232, 1235, 1238, 1240, 1242, 1245, 1248, 1250, 1252, 1255, 1258, 1260,
  1262, 1265, 1268, 1270, 1272, 1275, 1278, 1280, 1285, 1290, 1295, 1300,
  1305, 1310, 1315, 1320, 1325, 1330, 1340, 1350, 1360, 1370, 1380, 1398,
];

const MOCK_HISTORICAL_CUTOFFS: HistoricalCutoff[] = [
  { period: "2023-II", cutoffScore: 1228, admissionRate: 0.095 },
  { period: "2024-I", cutoffScore: 1242, admissionRate: 0.091 },
  { period: "2025-I", cutoffScore: 1248, admissionRate: 0.093 },
  { period: "2026-I", cutoffScore: 1255, admissionRate: 0.097 },
];

const MOCK_REACHABLE_PROGRAMS: ReachableProgram[] = [
  {
    id: "prog-farmacia",
    name: "Farmacia y Bioquímica",
    campus: "Lima",
    area: "A",
    cutoffScore: 1310,
    pointsDiff: 88,
    crossArea: false,
  },
  {
    id: "prog-enfermeria",
    name: "Enfermería",
    campus: "Lima",
    area: "A",
    cutoffScore: 1290,
    pointsDiff: 108,
    crossArea: false,
  },
  {
    id: "prog-biologia",
    name: "Biología",
    campus: "Lima",
    area: "A",
    cutoffScore: 1260,
    pointsDiff: 138,
    crossArea: false,
  },
  {
    id: "prog-nutricion",
    name: "Nutrición",
    campus: "Lima",
    area: "A",
    cutoffScore: 1215,
    pointsDiff: 183,
    crossArea: false,
  },
];

const MOCK_ADMITTED: ResultData = {
  applicant: { code: "100001", fullName: "García López, Ana María" },
  result: {
    score: 1398,
    rank: 2,
    status: "admitted",
    observation: "ALCANZO VACANTE",
  },
  program: { name: "Medicina Humana", area: "A", campus: "Lima" },
  modality: { code: "A", name: "Educación Básica Regular (EBR)" },
  process: { period: "2026-I", slug: "2026-1" },
  university: { acronym: "UNMSM", name: "Universidad Nacional Mayor de San Marcos", color: UNMSM_COLOR },
  computed: {
    pointsToAdmission: 143,
    percentileInProgram: 0.985,
    percentileInArea: 0.97,
    cutoffScore: 1255,
    totalApplicants: 2847,
    totalAdmitted: 60,
    admissionRate: 0.021,
    reachablePrograms: MOCK_REACHABLE_PROGRAMS,
    historicalCutoffs: MOCK_HISTORICAL_CUTOFFS,
    cutoffTendency: formatTendency([1228, 1242, 1248, 1255]),
    scoreDistribution: MOCK_SCORE_DISTRIBUTION_ADMITTED,
  },
};

const MOCK_NOT_ADMITTED: ResultData = {
  applicant: { code: "100002", fullName: "Quispe Mamani, Carlos Enrique" },
  result: {
    score: 1208,
    rank: null,
    status: "not_admitted",
    observation: "NO ALCANZO VACANTE",
  },
  program: { name: "Medicina Humana", area: "A", campus: "Lima" },
  modality: { code: "A", name: "Educación Básica Regular (EBR)" },
  process: { period: "2026-I", slug: "2026-1" },
  university: { acronym: "UNMSM", name: "Universidad Nacional Mayor de San Marcos", color: UNMSM_COLOR },
  computed: {
    pointsToAdmission: -47,
    percentileInProgram: 0.62,
    percentileInArea: 0.58,
    cutoffScore: 1255,
    totalApplicants: 2847,
    totalAdmitted: 60,
    admissionRate: 0.021,
    reachablePrograms: [
      {
        id: "prog-nutricion",
        name: "Nutrición",
        campus: "Lima",
        area: "A",
        cutoffScore: 1195,
        pointsDiff: 13,
        crossArea: false,
      },
    ],
    historicalCutoffs: MOCK_HISTORICAL_CUTOFFS,
    cutoffTendency: formatTendency([1228, 1242, 1248, 1255]),
    scoreDistribution: MOCK_SCORE_DISTRIBUTION_ADMITTED,
  },
};

const MOCK_BY_CODE: Record<string, ResultData> = {
  "100001": MOCK_ADMITTED,
  "100002": MOCK_NOT_ADMITTED,
};

export interface GetResultDataInput {
  universityAcronym: string;
  processSlug: string;
  applicantCode: string;
}

export async function getResultData({
  applicantCode,
}: GetResultDataInput): Promise<ResultData | null> {
  return MOCK_BY_CODE[applicantCode] ?? null;
}
