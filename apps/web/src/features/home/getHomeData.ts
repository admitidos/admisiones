import { unstable_cache } from "next/cache";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@admitidos/db";
import { formatRate } from "@/lib/utils/formatters";

// Home data changes only when a new process is scraped (2–3×/year), so cache it for a day
// to avoid re-querying Neon on every visit.
const ONE_DAY = 86400;

export type ProcessStatus = "new" | "published" | "upcoming";
export type UniversityStatus = "active" | "coming_soon";

export interface HomeFeaturedProcess {
  id: string;
  name: string;
  subtitle: string;
  status: ProcessStatus;
  university: { acronym: string; shortName: string };
  stats: {
    applicants: string;
    vacancies: string;
    programs: string;
    admissionRate: string;
  };
}

export interface HomePastProcess {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  status: ProcessStatus;
  university: { acronym: string; color: string };
}

export interface HomeUniversity {
  acronym: string;
  name: string;
  location: string;
  status: UniversityStatus;
  examCount: number;
}

export interface HomeData {
  featuredProcess: HomeFeaturedProcess | null;
  pastProcesses: HomePastProcess[];
  universities: HomeUniversity[];
}

const intFmt = new Intl.NumberFormat("es-PE");
const formatCount = (n: number | null | undefined): string => intFmt.format(n ?? 0);

const monthYear = (d: Date): string => {
  const s = format(d, "LLL yyyy", { locale: es }).replace(".", "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const admissionRate = (applicants: number | null, admitted: number | null): string =>
  applicants && admitted != null ? formatRate(admitted / applicants) : "—";

async function getHomeDataUncached(): Promise<HomeData> {
  const universities = await prisma.university.findMany({
    orderBy: { acronym: "asc" },
    include: { _count: { select: { processes: true } } },
  });

  const unmsm = universities.find((u) => u.acronym === "UNMSM");

  // Featured + past processes come from UNMSM (the only university with data today).
  const processes = unmsm
    ? await prisma.process.findMany({
        where: { universityId: unmsm.id },
        orderBy: [{ examYear: "desc" }, { examSemester: "desc" }],
        include: {
          examDates: { orderBy: { date: "asc" }, take: 1 },
          _count: { select: { programs: true } },
        },
      })
    : [];

  const [featured, ...past] = processes;
  const slugId = (slug: string): string => `${unmsm!.acronym.toLowerCase()}-${slug}`;

  return {
    featuredProcess:
      unmsm && featured
        ? {
            id: slugId(featured.slug),
            name: featured.period,
            subtitle: featured.examDates[0]
              ? `Examen general · Áreas A–E · ${monthYear(featured.examDates[0].date)}`
              : "Examen general · Áreas A–E",
            status: "new",
            university: { acronym: unmsm.acronym, shortName: unmsm.shortName ?? unmsm.name },
            stats: {
              applicants: formatCount(featured.totalApplicants),
              vacancies: "—", // not in scraped data yet — pending curated source (prospecto)
              programs: String(featured._count.programs),
              admissionRate: admissionRate(featured.totalApplicants, featured.totalAdmitted),
            },
          }
        : null,
    pastProcesses:
      unmsm
        ? past.map((p) => ({
            id: slugId(p.slug),
            name: `Admisión ${p.period}`,
            subtitle: `${p._count.programs} carreras · ${formatCount(p.totalApplicants)} postulantes`,
            date: p.examDates[0] ? monthYear(p.examDates[0].date) : "",
            status: "published",
            university: { acronym: unmsm.acronym, color: unmsm.color },
          }))
        : [],
    universities: universities.map((u) => ({
      acronym: u.acronym,
      name: u.shortName ?? u.name,
      location: u.location ?? "",
      status: u.status === "active" ? "active" : "coming_soon",
      examCount: u._count.processes,
    })),
  };
}

export const getHomeData = unstable_cache(getHomeDataUncached, ["home-data"], {
  revalidate: ONE_DAY,
  tags: ["home-data"],
});
