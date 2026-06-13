"use client";

import { useState, useCallback } from "react";
import { formatScore } from "@/lib/utils/formatters";

interface ScoreDistributionBarProps {
  scores: number[];
  applicantScore: number;
  cutoffScore: number | null;
  universityColor: string;
  totalApplicants: number;
}

const BUCKETS = 40;

function buildHistogram(scores: number[], buckets: number) {
  if (scores.length === 0) return [];
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const bucketSize = (max - min) / buckets;

  const counts = Array.from({ length: buckets }, (_, i) => ({
    min: min + i * bucketSize,
    max: min + (i + 1) * bucketSize,
    count: 0,
  }));

  for (const score of scores) {
    const idx = Math.min(Math.floor((score - min) / bucketSize), buckets - 1);
    counts[idx].count++;
  }

  return counts;
}

export function ScoreDistributionBar({
  scores,
  applicantScore,
  cutoffScore,
  universityColor,
  totalApplicants,
}: ScoreDistributionBarProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const histogram = buildHistogram(scores, BUCKETS);
  const maxCount = Math.max(...histogram.map((b) => b.count), 1);

  const onMouseLeave = useCallback(() => setHoveredIdx(null), []);

  return (
    <div
      data-testid="distribution-chart"
      className="rounded-lg border border-border bg-white p-5 sm:p-6"
    >
      <h2 className="mb-1 text-[13px] font-bold uppercase tracking-wide text-muted">
        Distribución de puntajes
      </h2>
      <p className="mb-4 text-[12px] text-muted">
        Cómo se distribuyen los {totalApplicants.toLocaleString("es-PE")} postulantes
      </p>

      <div
        className="flex h-24 items-end gap-px"
        onMouseLeave={onMouseLeave}
        aria-hidden="true"
      >
        {histogram.map((bucket, i) => {
          const isApplicant =
            applicantScore >= bucket.min && applicantScore < bucket.max;
          const isCutoff = cutoffScore !== null &&
            cutoffScore >= bucket.min && cutoffScore < bucket.max;
          const isAdmissionZone = cutoffScore !== null && bucket.min >= cutoffScore;
          const heightPercent = (bucket.count / maxCount) * 100;

          return (
            <button
              key={i}
              type="button"
              className="relative flex-1 cursor-default transition-opacity hover:opacity-80"
              style={{ height: `${Math.max(heightPercent, 2)}%` }}
              onMouseEnter={() => setHoveredIdx(i)}
              title={`${formatScore(bucket.min)}–${formatScore(bucket.max)}: ${bucket.count} postulantes`}
            >
              <div
                className="h-full w-full rounded-t-[2px]"
                style={{
                  background: isApplicant
                    ? universityColor
                    : isCutoff
                    ? "#a86b1a"
                    : isAdmissionZone
                    ? `${universityColor}55`
                    : "#e8eaed",
                  outline: hoveredIdx === i ? `1.5px solid ${universityColor}` : "none",
                }}
              />
            </button>
          );
        })}
      </div>

      {hoveredIdx !== null && histogram[hoveredIdx] && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
          <span>
            {formatScore(histogram[hoveredIdx].min)}–{formatScore(histogram[hoveredIdx].max)}
          </span>
          <span className="font-semibold text-foreground">
            {histogram[hoveredIdx].count} postulantes
          </span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[2px]" style={{ background: universityColor }} />
          <span>Tu puntaje</span>
        </div>
        {cutoffScore !== null && (
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[2px] bg-amber-600" />
            <span>Puntaje de corte ({formatScore(cutoffScore)})</span>
          </div>
        )}
        {cutoffScore !== null && (
          <div className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-[2px]"
              style={{ background: `${universityColor}55` }}
            />
            <span>Zona de admisión</span>
          </div>
        )}
      </div>
    </div>
  );
}
