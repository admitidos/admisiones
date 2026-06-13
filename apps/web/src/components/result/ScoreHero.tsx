import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ModalidadBadge } from "@/components/ui/ModalidadBadge";
import { AreaChip } from "@/components/ui/AreaChip";
import { formatScore, formatPoints } from "@/lib/utils/formatters";
import type { ApplicantStatus } from "@/features/result/getResultData";
import type { Area } from "@/features/process/getProcessData";

const STATUS_CONFIG: Record<
  ApplicantStatus,
  { label: string; bg: string; color: string; border: string }
> = {
  admitted: { label: "Ingresó", bg: "#eef7f1", color: "#1c6b3a", border: "#c0deca" },
  not_admitted: { label: "No ingresó", bg: "#faf4e8", color: "#a86b1a", border: "#f0d9b0" },
  absent: { label: "Ausente", bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
  disqualified: { label: "Inhabilitado", bg: "#f3f4f6", color: "#4b5563", border: "#d1d5db" },
};

interface ScoreHeroProps {
  fullName: string;
  applicantCode: string;
  score: number;
  status: ApplicantStatus;
  rank: number | null;
  programName: string;
  campus: string;
  area: Area | null;
  modality: { code: string; name: string };
  university: { acronym: string; name: string };
  process: { period: string; slug: string };
  computed: {
    pointsToAdmission: number;
    percentileInProgram: number;
    percentileInArea: number;
    totalApplicants: number;
    totalAdmitted: number;
  };
}

function StatusBadge({ status }: { status: ApplicantStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      data-testid="applicant-status"
      className="inline-flex items-center rounded-sm px-3 py-1 text-sm font-bold"
      style={{ background: config.bg, color: config.color, border: `1.5px solid ${config.border}` }}
    >
      {config.label}
    </span>
  );
}

function ContextPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
      {children}
    </div>
  );
}

export function ScoreHero({
  fullName,
  applicantCode,
  score,
  status,
  rank,
  programName,
  campus,
  area,
  modality,
  university,
  process,
  computed,
}: ScoreHeroProps) {
  const admitted = status === "admitted";
  const pointsFormatted = formatPoints(computed.pointsToAdmission);
  const topPercent = Math.round((1 - computed.percentileInProgram) * 100);
  const topAreaPercent = Math.round((1 - computed.percentileInArea) * 100);

  return (
    <section
      data-testid="score-hero"
      className="bg-[var(--hero-bg)] px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6 lg:px-12"
    >
      <div className="mx-auto max-w-180">
        <Breadcrumb
          light
          items={[
            { label: university.acronym, href: `/${university.acronym.toLowerCase()}` },
            {
              label: `Admisión ${process.period}`,
              href: `/${university.acronym.toLowerCase()}/${process.slug}`,
            },
            { label: fullName },
          ]}
        />

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              {area && <AreaChip area={area} size="md" />}
              <ModalidadBadge code={modality.code} name={modality.name} />
            </div>

            <h1 className="mb-1 font-serif text-[22px] font-bold leading-tight tracking-tight text-white sm:text-[26px]">
              {fullName}
            </h1>
            <p className="text-[13px] text-white/70">
              Código {applicantCode} · {programName}
              {campus ? ` — ${campus}` : ""}
            </p>
          </div>

          <div className="shrink-0 text-center sm:text-right">
            <div
              data-testid="score-value"
              className="font-serif text-[64px] font-black leading-none tracking-tight text-white sm:text-[80px]"
            >
              {formatScore(score)}
            </div>
            <div className="mt-1 text-[12px] font-semibold uppercase tracking-widest text-white/60">
              puntos
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {admitted && rank !== null && (
            <ContextPill>
              <span>🏅</span>
              <span>Puesto #{rank} de {computed.totalAdmitted} ingresantes</span>
            </ContextPill>
          )}
          <ContextPill>
            <span>Superaste al {100 - topPercent}% · top {topPercent}% en {programName}</span>
          </ContextPill>
          <ContextPill>
            <span>Top {topAreaPercent}% en {area ? `Área ${area}` : "tu área"}</span>
          </ContextPill>
          <div data-testid="points-to-admission">
            <ContextPill>
              <span
                className="font-bold"
                style={{ color: admitted ? "#4ade80" : "#fbbf24" }}
              >
                {pointsFormatted}
              </span>
              <span>{admitted ? "sobre el corte" : "para el corte"}</span>
            </ContextPill>
          </div>
        </div>
      </div>
    </section>
  );
}
