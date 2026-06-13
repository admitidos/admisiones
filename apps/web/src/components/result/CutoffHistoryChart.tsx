import { formatScore } from "@/lib/utils/formatters";
import type { HistoricalCutoff } from "@/features/result/getResultData";
import type { Tendency } from "@/lib/utils/formatters";

interface CutoffHistoryChartProps {
  historicalCutoffs: HistoricalCutoff[];
  currentScore: number;
  tendency: Tendency;
  programName: string;
  universityColor: string;
}

const TENDENCY_LABEL: Record<Tendency, string> = {
  rising: "↑ Subiendo",
  falling: "↓ Bajando",
  stable: "→ Estable",
};

const TENDENCY_COLOR: Record<Tendency, string> = {
  rising: "#a86b1a",
  falling: "#1c6b3a",
  stable: "#6b7280",
};

export function CutoffHistoryChart({
  historicalCutoffs,
  currentScore,
  tendency,
  programName,
  universityColor,
}: CutoffHistoryChartProps) {
  const scores = historicalCutoffs.map((h) => h.cutoffScore);
  const maxScore = Math.max(...scores, currentScore) + 50;
  const minScore = Math.min(...scores, currentScore) - 80;
  const range = maxScore - minScore;

  const toY = (score: number, height: number) =>
    height - ((score - minScore) / range) * height;

  const WIDTH = 300;
  const HEIGHT = 100;
  const BAR_W = 36;
  const GAP = (WIDTH - BAR_W * historicalCutoffs.length) / (historicalCutoffs.length + 1);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgY = toY(avgScore, HEIGHT);
  const currentY = toY(currentScore, HEIGHT);

  const admittedCount = historicalCutoffs.filter((h) => currentScore >= h.cutoffScore).length;

  return (
    <div
      data-testid="cutoff-history-chart"
      className="rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-muted">
            Puntaje de corte histórico
          </h2>
          <p className="mt-0.5 text-[12px] text-muted">{programName}</p>
        </div>
        <span
          className="shrink-0 rounded-sm px-2 py-0.5 text-[11px] font-bold"
          style={{ color: TENDENCY_COLOR[tendency], background: `${TENDENCY_COLOR[tendency]}18` }}
        >
          {TENDENCY_LABEL[tendency]}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT + 24}`}
        className="w-full"
        aria-label="Historial de puntajes de corte"
      >
        <line
          x1={0}
          y1={avgY}
          x2={WIDTH}
          y2={avgY}
          stroke="#e8eaed"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {historicalCutoffs.map((h, i) => {
          const x = GAP + i * (BAR_W + GAP);
          const barH = HEIGHT - toY(h.cutoffScore, HEIGHT);
          const barY = toY(h.cutoffScore, HEIGHT);
          const isLast = i === historicalCutoffs.length - 1;

          return (
            <g key={h.period}>
              <rect
                x={x}
                y={barY}
                width={BAR_W}
                height={barH}
                rx={4}
                fill={isLast ? universityColor : "#e8eaed"}
                opacity={isLast ? 1 : 0.7}
              />
              <text
                x={x + BAR_W / 2}
                y={barY - 5}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fill={isLast ? universityColor : "#6b7280"}
              >
                {formatScore(h.cutoffScore)}
              </text>
              <text
                x={x + BAR_W / 2}
                y={HEIGHT + 14}
                textAnchor="middle"
                fontSize={8}
                fill="#9ca3af"
              >
                {h.period}
              </text>
            </g>
          );
        })}

        <line
          x1={0}
          y1={currentY}
          x2={WIDTH}
          y2={currentY}
          stroke="#4338ca"
          strokeWidth={1.5}
          strokeDasharray="6 3"
          opacity={0.6}
        />
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-[2px] w-5 rounded" style={{ background: universityColor }} />
          <span>Corte histórico</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[2px] w-5 rounded bg-accent opacity-60" />
          <span>Tu puntaje</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[2px] w-5 border-t border-dashed border-border" />
          <span>Promedio histórico</span>
        </div>
      </div>

      <div className="mt-3 rounded-sm border border-border bg-background px-3.5 py-2.5 text-[12px] text-muted">
        Con tu puntaje habrías ingresado en{" "}
        <span className="font-bold" style={{ color: admittedCount > 0 ? universityColor : "#a86b1a" }}>
          {admittedCount} de {historicalCutoffs.length}
        </span>{" "}
        procesos anteriores.
      </div>
    </div>
  );
}
