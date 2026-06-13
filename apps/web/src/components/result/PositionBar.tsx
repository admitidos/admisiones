import { formatScore } from "@/lib/utils/formatters";

interface PositionBarProps {
  score: number;
  cutoffScore: number | null;
  minScore: number;
  maxScore: number;
  percentile: number;
  universityColor: string;
}

const toPercent = (value: number, min: number, max: number) =>
  Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

export function PositionBar({
  score,
  cutoffScore,
  minScore,
  maxScore,
  percentile,
  universityColor,
}: PositionBarProps) {
  const scorePos = toPercent(score, minScore, maxScore);
  const cutoffPos = cutoffScore !== null ? toPercent(cutoffScore, minScore, maxScore) : null;
  const admitted = cutoffScore !== null && score >= cutoffScore;

  return (
    <div data-testid="position-bar" className="rounded-lg border border-border bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-[13px] font-bold uppercase tracking-wide text-muted">
        Tu posición entre los postulantes
      </h2>

      <div className="relative h-8 w-full overflow-hidden rounded-sm bg-border">
        {cutoffPos !== null && (
          <>
            <div
              className="absolute inset-y-0 left-0 opacity-25"
              style={{ width: `${cutoffPos}%`, background: "#a86b1a" }}
            />
            <div
              className="absolute inset-y-0 opacity-20"
              style={{
                left: `${cutoffPos}%`,
                right: 0,
                background: universityColor,
              }}
            />
          </>
        )}

        {cutoffPos !== null && (
          <div
            className="absolute inset-y-0 w-[2px] bg-amber-500"
            style={{ left: `${cutoffPos}%` }}
          />
        )}

        <div
          className="absolute inset-y-0 w-1 rounded-full"
          style={{
            left: `${scorePos}%`,
            transform: "translateX(-50%)",
            background: admitted ? universityColor : "#a86b1a",
            boxShadow: `0 0 0 2px white, 0 0 0 4px ${admitted ? universityColor : "#a86b1a"}`,
          }}
        />
      </div>

      <div className="mt-3 flex items-end justify-between gap-2 text-[11px] text-muted">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">{formatScore(minScore)}</span>
          <span>mínimo</span>
        </div>
        {cutoffScore !== null && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-semibold text-amber-700">{formatScore(cutoffScore)}</span>
            <span>corte</span>
          </div>
        )}
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-semibold text-foreground">{formatScore(maxScore)}</span>
          <span>máximo</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-sm border border-border bg-background px-4 py-2.5">
        <span className="text-[12px] text-muted">Superaste a</span>
        <span className="font-serif text-[22px] font-bold" style={{ color: universityColor }}>
          {Math.round(percentile * 100)}%
        </span>
        <span className="text-[12px] text-muted">de los postulantes</span>
      </div>
    </div>
  );
}
