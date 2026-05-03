export type ProcessStatus = "new" | "published" | "upcoming";
export type UniversityStatus = "active" | "coming_soon";

export interface HomeProcess {
  id: string;
  name: string;
  status: ProcessStatus;
  date: string;
  university: {
    acronym: string;
    color: string;
  };
}

export interface HomeData {
  featuredProcess: HomeProcess;
  processes: HomeProcess[];
}

const MOCK: HomeData = {
  featuredProcess: {
    id: "unmsm-2026-1",
    name: "2026-I",
    status: "new",
    date: "27 abr 2026",
    university: { acronym: "UNMSM", color: "#1c6b3a" },
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
};

export async function getHomeData(): Promise<HomeData> {
  return MOCK;
}
