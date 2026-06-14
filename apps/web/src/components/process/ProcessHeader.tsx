import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatTile } from "@/components/ui/StatTile";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRate } from "@/lib/utils/formatters";

interface ProcessHeaderProps {
  university: { acronym: string; name: string };
  process: { period: string };
  stats: {
    totalApplicants: number;
    totalVacancies: number;
    programCount: number;
    admissionRate: number;
  };
}

export function ProcessHeader({ university, process, stats }: ProcessHeaderProps) {
  return (
    <section
      data-testid="process-header"
      className="px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6 lg:px-12"
      style={{ background: "var(--hero-bg)" }}
    >
      <div className="mx-auto max-w-180">
        <Breadcrumb
          light
          items={[
            { label: university.acronym, href: `/${university.acronym.toLowerCase()}` },
            { label: `Admisión ${process.period}` },
          ]}
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status="published" />
        </div>

        <h1 className="mt-3 font-serif text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">
          {university.acronym} {process.period}
        </h1>
        <p className="mt-1 text-[13px] text-white/70">
          Selecciona tu carrera y modalidad para ver el listado de ingresantes.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              value: stats.totalApplicants.toLocaleString("es-PE"),
              label: "Postulantes",
            },
            {
              value: stats.totalVacancies > 0 ? stats.totalVacancies.toLocaleString("es-PE") : "—",
              label: "Vacantes",
            },
            {
              value: String(stats.programCount),
              label: "Carreras",
            },
            {
              value: formatRate(stats.admissionRate),
              label: "Tasa de ingreso",
            },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="rounded-sm bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <div className="font-serif text-[24px] font-bold leading-none text-white">
                {value}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
