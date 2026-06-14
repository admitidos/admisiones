import Link from "next/link";
import { formatScore } from "@/lib/utils/formatters";
import { ApplicantSearch } from "./ApplicantSearch";
import type { ProcessApplicant } from "@/features/process/getProcessData";

const STATUS_LABEL: Record<string, string> = {
  admitted: "Ingresó",
  not_admitted: "No ingresó",
  absent: "Ausente",
  disqualified: "Inhabilitado",
};

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  admitted: { bg: "#eef7f1", color: "#1c6b3a" },
  not_admitted: { bg: "#faf4e8", color: "#a86b1a" },
  absent: { bg: "#f3f4f6", color: "#4b5563" },
  disqualified: { bg: "#f3f4f6", color: "#4b5563" },
};

interface ApplicantTableProps {
  applicants: ProcessApplicant[];
  cutoffScore: number | null;
  universityAcronym: string;
  processSlug: string;
  universityColor: string;
  total: number; // count matching the current query
  unfilteredTotal: number; // program's full applicant count
  page: number;
  totalPages: number;
  query: string;
}

export function ApplicantTable({
  applicants,
  cutoffScore,
  universityAcronym,
  processSlug,
  universityColor,
  total,
  unfilteredTotal,
  page,
  totalPages,
  query,
}: ApplicantTableProps) {
  const hrefFor = (p: number): string => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

  return (
    <div>
      <ApplicantSearch totalCount={unfilteredTotal} filteredCount={total} query={query} />

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="w-12 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-muted">
                  #
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Apellidos y nombres
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Código
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted">
                  Puntaje
                </th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[13px] text-muted">
                    {query
                      ? `No se encontraron resultados para "${query}"`
                      : "No hay postulantes para esta carrera."}
                  </td>
                </tr>
              ) : (
                applicants.map((applicant) => {
                  const style = STATUS_STYLE[applicant.status] ?? STATUS_STYLE.not_admitted;
                  const admitted = applicant.status === "admitted";
                  return (
                    <tr
                      key={applicant.code}
                      data-testid="applicant-row"
                      data-applicant-code={applicant.code}
                      className="cursor-pointer transition-colors hover:bg-border/30"
                    >
                      <td className="px-4 py-3 text-center font-serif text-[13px] text-muted">
                        {applicant.rank !== null ? `#${applicant.rank}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/${universityAcronym.toLowerCase()}/${processSlug}/applicant/${applicant.code}`}
                          className="text-[14px] font-semibold text-foreground hover:text-accent"
                        >
                          {applicant.fullName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-muted">
                        {applicant.code}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="font-serif text-[15px] font-bold"
                          style={{
                            color: cutoffScore !== null && admitted ? universityColor : "#a86b1a",
                          }}
                        >
                          {formatScore(applicant.score)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-sm px-2 py-0.5 text-[11px] font-bold"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {STATUS_LABEL[applicant.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            {page > 1 ? (
              <Link
                href={hrefFor(page - 1)}
                rel="prev"
                className="rounded-sm border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground transition-colors hover:border-foreground"
              >
                ← Anterior
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-[12px] text-muted/50">← Anterior</span>
            )}

            <span className="text-[12px] text-muted">
              Página {page} de {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                href={hrefFor(page + 1)}
                rel="next"
                className="rounded-sm border border-border px-3 py-1.5 text-[12px] font-semibold text-foreground transition-colors hover:border-foreground"
              >
                Siguiente →
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-[12px] text-muted/50">Siguiente →</span>
            )}
          </div>
        )}

        {applicants.length > 0 && totalPages <= 1 && (
          <div className="border-t border-border px-4 py-3 text-[11px] text-muted">
            Haz clic en cualquier postulante para ver su resultado completo.
          </div>
        )}
      </div>
    </div>
  );
}
