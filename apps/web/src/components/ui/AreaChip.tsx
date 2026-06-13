import type { Area } from "@/features/process/getProcessData";

const AREA_CONFIG: Record<
  Area,
  { label: string; bg: string; color: string; border: string }
> = {
  A: { label: "Área A", bg: "#eef7f1", color: "#1c6b3a", border: "#c0deca" },
  B: { label: "Área B", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  C: { label: "Área C", bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  D: { label: "Área D", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  E: { label: "Área E", bg: "#fefce8", color: "#a16207", border: "#fef08a" },
};

interface AreaChipProps {
  area: Area;
  size?: "sm" | "md";
}

export function AreaChip({ area, size = "sm" }: AreaChipProps) {
  const config = AREA_CONFIG[area];
  return (
    <span
      data-testid={`area-chip-${area}`}
      className={
        size === "sm"
          ? "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-bold"
          : "inline-flex items-center rounded px-2.5 py-1 text-xs font-bold"
      }
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}

export { AREA_CONFIG };
