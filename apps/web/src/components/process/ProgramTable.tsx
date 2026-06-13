import Link from "next/link";
import { AreaChip } from "@/components/ui/AreaChip";
import { ModalidadBadge } from "@/components/ui/ModalidadBadge";
import { formatScore, formatRate } from "@/lib/utils/formatters";
import type { ProcessProgramWithApplicants, Area } from "@/features/process/getProcessData";
import { pipe, filter, groupBy, entries, sortBy } from "remeda";

interface ProgramTableProps {
  programs: ProcessProgramWithApplicants[];
  selectedArea: Area | null;
  universityAcronym: string;
  processSlug: string;
  universityColor: string;
}

export function ProgramTable({
  programs,
  selectedArea,
  universityAcronym,
  processSlug,
  universityColor,
}: ProgramTableProps) {
  const filtered = pipe(
    programs,
    filter((p) => selectedArea === null || p.area === selectedArea),
  );

  const grouped = pipe(
    filtered,
    groupBy((p) => p.area ?? "Sin área"),
  );

  const areaOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, "Sin área": 5 };
  const sortedGroups = pipe(
    entries(grouped),
    sortBy(([area]) => areaOrder[area] ?? 99),
  );

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center text-[14px] text-muted">
        No hay carreras para el área seleccionada.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedGroups.map(([area, areaPrograms]) => (
        <div key={area}>
          <div className="mb-2 flex items-center gap-2 px-1">
            {area !== "Sin área" && <AreaChip area={area as Area} size="md" />}
            <span className="text-[12px] text-muted">
              {areaPrograms.length} {areaPrograms.length === 1 ? "carrera" : "carreras"}
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                      Carrera
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                      Modalidad
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted">
                      Vacantes
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted">
                      Corte
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted">
                      Tasa
                    </th>
                    <th className="w-0 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {areaPrograms.map((program) => (
                    <tr
                      key={program.id}
                      data-testid="program-row"
                      className="cursor-pointer transition-colors hover:bg-border/30"
                    >
                      <td className="px-4 py-3">
                        <div className="text-[14px] font-semibold text-foreground">
                          {program.name}
                        </div>
                        <div className="text-[12px] text-muted">{program.campus}</div>
                      </td>
                      <td className="px-4 py-3">
                        <ModalidadBadge
                          code={program.modalityCode}
                          name={program.modalityName}
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-serif text-[15px] font-bold text-foreground">
                        {program.vacancies}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {program.cutoffScore !== null ? (
                          <span
                            className="font-serif text-[15px] font-bold"
                            style={{ color: universityColor }}
                          >
                            {formatScore(program.cutoffScore)}
                          </span>
                        ) : (
                          <span className="text-[13px] text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-[13px] text-muted">
                        {program.admissionRate !== null
                          ? formatRate(program.admissionRate)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/${universityAcronym.toLowerCase()}/${processSlug}/${program.id}`}
                          className="text-[12px] font-semibold text-accent hover:underline"
                          data-testid={`program-link-${program.id}`}
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
