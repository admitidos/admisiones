"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { pipe, filter } from "remeda";
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
}

export function ApplicantTable({
  applicants,
  cutoffScore,
  universityAcronym,
  processSlug,
  universityColor,
}: ApplicantTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      query.trim() === ""
        ? applicants
        : pipe(
            applicants,
            filter(
              (a) =>
                a.fullName.toLowerCase().includes(query.toLowerCase()) ||
                a.code.includes(query),
            ),
          ),
    [applicants, query],
  );

  const handleSearch = useCallback((q: string) => setQuery(q), []);

  return (
    <div>
      <ApplicantSearch
        onSearch={handleSearch}
        totalCount={applicants.length}
        filteredCount={filtered.length}
      />

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[13px] text-muted">
                    No se encontraron resultados para "{query}"
                  </td>
                </tr>
              ) : (
                filtered.map((applicant) => {
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
                            color:
                              cutoffScore !== null && admitted
                                ? universityColor
                                : "#a86b1a",
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
        {filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-[11px] text-muted">
            Haz clic en cualquier postulante para ver su resultado completo.
          </div>
        )}
      </div>
    </div>
  );
}
