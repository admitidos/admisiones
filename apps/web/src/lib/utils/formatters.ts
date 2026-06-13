const peruScoreFormat = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatScore = (score: number): string => peruScoreFormat.format(score);

export const formatPercentile = (percentile: number): string => {
  const top = Math.round((1 - percentile) * 100);
  return `top ${top}%`;
};

export const formatRate = (rate: number): string =>
  `${(rate * 100).toFixed(1)}%`;

export const formatPoints = (points: number): string => {
  const sign = points >= 0 ? "+" : "−";
  return `${sign}${Math.abs(points)} pts`;
};

export type Tendency = "rising" | "falling" | "stable";

export const formatTendency = (scores: number[]): Tendency => {
  if (scores.length < 2) return "stable";
  const deltas = scores.slice(1).map((s, i) => s - scores[i]);
  const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  if (avg > 5) return "rising";
  if (avg < -5) return "falling";
  return "stable";
};
