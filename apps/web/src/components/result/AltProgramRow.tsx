import Link from "next/link";
import { formatScore, formatPoints } from "@/lib/utils/formatters";

interface AltProgramRowProps {
  id: string;
  name: string;
  campus: string;
  cutoffScore: number;
  pointsDiff: number;
  crossArea: boolean;
  universityAcronym: string;
  processSlug: string;
}

export function AltProgramRow({
  id,
  name,
  campus,
  cutoffScore,
  pointsDiff,
  crossArea,
  universityAcronym,
  processSlug,
}: AltProgramRowProps) {
  const wouldAdmit = pointsDiff >= 0;

  return (
    <Link
      href={`/${universityAcronym.toLowerCase()}/${processSlug}/${id}`}
      data-testid="alt-program-row"
      className="flex items-center gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-border/40"
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
        style={{
          background: wouldAdmit ? "#eef7f1" : "#faf4e8",
          color: wouldAdmit ? "#1c6b3a" : "#a86b1a",
        }}
        aria-hidden="true"
      >
        {wouldAdmit ? "✓" : "≈"}
      </span>

      <div className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-foreground">{name}</span>
        <span className="text-[11px] text-muted">{campus}</span>
        {crossArea && (
          <span className="mt-0.5 inline-block text-[10px] font-bold text-amber-700">
            ⚠ Área distinta — referencial
          </span>
        )}
      </div>

      <div className="shrink-0 text-right">
        <div className="font-serif text-[16px] font-bold text-foreground">
          {formatScore(cutoffScore)}
        </div>
        <div
          className="text-[11px] font-bold"
          style={{ color: wouldAdmit ? "#1c6b3a" : "#a86b1a" }}
        >
          {formatPoints(pointsDiff)}
        </div>
      </div>
    </Link>
  );
}
