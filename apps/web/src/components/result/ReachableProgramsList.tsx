import { AltProgramRow } from "./AltProgramRow";
import type { ReachableProgram } from "@/features/result/getResultData";

interface ReachableProgramsListProps {
  programs: ReachableProgram[];
  currentProgramId: string;
  universityAcronym: string;
  processSlug: string;
}

export function ReachableProgramsList({
  programs,
  currentProgramId,
  universityAcronym,
  processSlug,
}: ReachableProgramsListProps) {
  const alternatives = programs.filter((p) => p.id !== currentProgramId);
  const hasCrossArea = alternatives.some((p) => p.crossArea);

  if (alternatives.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="reachable-programs"
      className="rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <div className="mb-3">
        <h2 className="text-[13px] font-bold uppercase tracking-wide text-muted">
          ¿Habrías ingresado a estas carreras?
        </h2>
        {hasCrossArea && (
          <p className="mt-1 text-[11px] text-amber-700">
            ⚠ Algunas carreras son de áreas distintas — los exámenes tienen secciones diferentes.
          </p>
        )}
      </div>

      <div className="divide-y divide-border">
        {alternatives.map((p) => (
          <AltProgramRow
            key={p.id}
            id={p.id}
            name={p.name}
            campus={p.campus}
            cutoffScore={p.cutoffScore}
            pointsDiff={p.pointsDiff}
            crossArea={p.crossArea}
            universityAcronym={universityAcronym}
            processSlug={processSlug}
          />
        ))}
      </div>
    </div>
  );
}
