export type ProcessStatus = "new" | "published" | "upcoming";
export type UniversityStatus = "active" | "coming_soon";

export interface HomeProcess {
  id: string;
  name: string;
  status: ProcessStatus;
  date: string;
  university: { acronym: string; color: string };
}

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
  featuredProcess: HomeFeaturedProcess;
  processes: HomeProcess[];
  pastProcesses: HomePastProcess[];
  universities: HomeUniversity[];
}

const MOCK: HomeData = {
  featuredProcess: {
    id: "unmsm-2026-1",
    name: "2026-I",
    subtitle: "Examen general · Áreas A–E · Mar 2026",
    status: "new",
    university: { acronym: "UNMSM", shortName: "San Marcos" },
    stats: {
      applicants: "26,507",
      vacancies: "2,561",
      programs: "73",
      admissionRate: "9.7%",
    },
  },
  processes: [
    {
      id: "unmsm-2026-1",
      name: "2026-I",
      status: "new",
      date: "27 abr 2026",
      university: { acronym: "UNMSM", color: "#1c6b3a" },
    },
    {
      id: "uni-2026-1",
      name: "2026-I",
      status: "published",
      date: "15 mar 2026",
      university: { acronym: "UNI", color: "#1e40af" },
    },
    {
      id: "unmsm-2025-2",
      name: "2025-II",
      status: "published",
      date: "12 ene 2026",
      university: { acronym: "UNMSM", color: "#1c6b3a" },
    },
    {
      id: "uni-2025-2",
      name: "2025-II",
      status: "published",
      date: "20 dic 2025",
      university: { acronym: "UNI", color: "#1e40af" },
    },
  ],
  pastProcesses: [
    {
      id: "uni-2026-1",
      name: "Admisión 2026-I · DIAD",
      subtitle: "3 jornadas · Feb 2026 · 6,032 postulantes",
      date: "Feb 2026",
      status: "published",
      university: { acronym: "UNI", color: "#b45309" },
    },
    {
      id: "unmsm-2025-2",
      name: "Admisión 2025-II · General A",
      subtitle: "Examen general · Mar 2025 · 26,507 postulantes",
      date: "Mar 2025",
      status: "published",
      university: { acronym: "UNMSM", color: "#1c6b3a" },
    },
    {
      id: "unmsm-2025-2-especial",
      name: "Admisión 2025-II · Especial",
      subtitle: "Modalidad especial · Mar 2025",
      date: "Mar 2025",
      status: "published",
      university: { acronym: "UNMSM", color: "#1c6b3a" },
    },
    {
      id: "unmsm-2025-1",
      name: "Admisión 2025-I · EBR / EBA",
      subtitle: "Examen general · Oct 2024 · 24,891 postulantes",
      date: "Oct 2024",
      status: "published",
      university: { acronym: "UNMSM", color: "#1c6b3a" },
    },
    {
      id: "unmsm-2024-2",
      name: "Admisión 2024-II · General A",
      subtitle: "Examen general · Mar 2024 · 25,312 postulantes",
      date: "Mar 2024",
      status: "published",
      university: { acronym: "UNMSM", color: "#1c6b3a" },
    },
  ],
  universities: [
    {
      acronym: "UNMSM",
      name: "San Marcos",
      location: "Lima",
      status: "active",
      examCount: 6,
    },
    {
      acronym: "UNI",
      name: "Ingeniería",
      location: "Lima",
      status: "active",
      examCount: 2,
    },
    {
      acronym: "UNSA",
      name: "San Agustín",
      location: "Arequipa",
      status: "coming_soon",
      examCount: 0,
    },
    {
      acronym: "UNSAAC",
      name: "San Antonio Abad",
      location: "Cusco",
      status: "coming_soon",
      examCount: 0,
    },
  ],
};

export async function getHomeData(): Promise<HomeData> {
  return MOCK;
}
