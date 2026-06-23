export interface CalendarUniversity {
  id: string;
  acronym: string;
  abbr: string;
  name: string;
  city: string;
  color: string;
  colorLight: string;
  colorBorder: string;
  defaultActive: boolean;
}

export interface CalendarSession {
  dateLabel: string;
  description: string;
  time: string;
}

export interface CalendarExam {
  id: string;
  universityId: string;
  universityLabel: string;
  name: string;
  meta: string;
  dayLabel: string;
  monthLabel: string;
  countdown?: { display: string; label: string };
  sessions: CalendarSession[];
}

export interface CalendarNoDataCard {
  universityId: string;
  universityLabel: string;
  title: string;
  description: string;
  badge: string;
}

export interface CalendarData {
  universities: CalendarUniversity[];
  exams: CalendarExam[];
  noDataCards: CalendarNoDataCard[];
}

const MOCK: CalendarData = {
  universities: [
    {
      id: "unmsm",
      acronym: "UNMSM",
      abbr: "SM",
      name: "San Marcos",
      city: "Lima",
      color: "#15803d",
      colorLight: "#f0fdf4",
      colorBorder: "#bbf7d0",
      defaultActive: true,
    },
    {
      id: "uni",
      acronym: "UNI",
      abbr: "UNI",
      name: "Ingeniería",
      city: "Lima",
      color: "#b45309",
      colorLight: "#fef3c7",
      colorBorder: "#fde68a",
      defaultActive: true,
    },
    {
      id: "unfv",
      acronym: "UNFV",
      abbr: "FV",
      name: "Villarreal",
      city: "Lima",
      color: "#7c3aed",
      colorLight: "#f5f3ff",
      colorBorder: "#ddd6fe",
      defaultActive: false,
    },
    {
      id: "unsaac",
      acronym: "UNSAAC",
      abbr: "AA",
      name: "San Antonio Abad",
      city: "Cusco",
      color: "#0f766e",
      colorLight: "#f0fdfa",
      colorBorder: "#99f6e4",
      defaultActive: false,
    },
  ],
  exams: [
    {
      id: "unmsm-2026-1",
      universityId: "unmsm",
      universityLabel: "San Marcos · Lima",
      name: "Admisión 2026-I — EBR / EBA",
      meta: "73 carreras · 2,561 vacantes · 26,507 postulantes",
      dayLabel: "7",
      monthLabel: "mar",
      sessions: [
        {
          dateLabel: "Sáb 7 mar · Jornada 1",
          description: "Áreas D (Económicas) y E (Humanidades)",
          time: "10:00 am",
        },
        {
          dateLabel: "Dom 8 mar · Jornada 2",
          description: "Áreas B (Ciencias Básicas), C (Ingenierías) y Especial",
          time: "10:00 am",
        },
        {
          dateLabel: "Sáb 14 mar · Jornada 3",
          description: "Área A — Salud (excepto Medicina Humana)",
          time: "10:00 am",
        },
        {
          dateLabel: "Dom 15 mar · Jornada 4",
          description: "Área A — Medicina Humana (fecha exclusiva)",
          time: "10:00 am",
        },
      ],
    },
    {
      id: "uni-2026-2",
      universityId: "uni",
      universityLabel: "Ingeniería · Lima",
      name: "Admisión 2026-II — DIAD",
      meta: "34 carreras · ~6,000 postulantes · Puntaje acumulativo en 3 jornadas",
      dayLabel: "~17",
      monthLabel: "ago",
      countdown: { display: "~104", label: "días estimados" },
      sessions: [
        {
          dateLabel: "~Lun 17 ago · Jornada 1",
          description: "Razonamiento matemático, verbal y humanidades",
          time: "8:00 am",
        },
        {
          dateLabel: "~Mié 19 ago · Jornada 2",
          description: "Matemática pura: aritmética, álgebra, geometría, trigonometría",
          time: "8:00 am",
        },
        {
          dateLabel: "~Vie 21 ago · Jornada 3",
          description: "Ciencias: física, química y biología",
          time: "8:00 am",
        },
      ],
    },
  ],
  noDataCards: [
    {
      universityId: "unfv",
      universityLabel: "Villarreal · Lima",
      title: "Sin cronograma publicado aún",
      description:
        "La UNFV no ha publicado las fechas de su próximo examen ordinario. Suele publicar su cronograma entre marzo y abril para exámenes de mitad de año.",
      badge: "60 carreras · ~11,500 postulantes por año",
    },
    {
      universityId: "unsaac",
      universityLabel: "San Antonio Abad · Cusco",
      title: "Próximamente en admisiones",
      description:
        "Estamos incorporando los exámenes de la UNSAAC. Es la universidad pública del sur del Perú con mayor número de postulantes de regiones como Apurímac, Puno y Madre de Dios.",
      badge: "~18,200 postulantes por año",
    },
  ],
};

// TODO (see ROADMAP.md › NEXT): still mock — the only non-real feature fn. Can't wire to
// the DB yet because there are no upcoming ExamDate rows (all are historical, scraped from
// past results). Needs announced future schedules entered manually, then query University +
// ExamDate. Until then this is hand-curated forward-looking content.
export async function getCalendarData(): Promise<CalendarData> {
  return MOCK;
}
