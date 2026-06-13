"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { AREA_CONFIG } from "@/components/ui/AreaChip";
import type { Area } from "@/features/process/getProcessData";

const AREAS: Area[] = ["A", "B", "C", "D", "E"];

interface AreaFilterProps {
  availableAreas: Area[];
  selectedArea: Area | null;
}

export function AreaFilter({ availableAreas, selectedArea }: AreaFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setArea = useCallback(
    (area: Area | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (area) {
        params.set("area", area);
      } else {
        params.delete("area");
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div
      data-testid="area-filter"
      role="group"
      aria-label="Filtrar por área"
      className="flex flex-wrap gap-2"
    >
      <button
        type="button"
        data-testid="area-filter-all"
        onClick={() => setArea(null)}
        aria-pressed={selectedArea === null}
        className="rounded-sm border px-3 py-1.5 text-[12px] font-bold transition-all"
        style={
          selectedArea === null
            ? { background: "var(--foreground)", color: "white", borderColor: "var(--foreground)" }
            : { background: "white", color: "var(--muted)", borderColor: "var(--border)" }
        }
      >
        Todas
      </button>

      {AREAS.filter((a) => availableAreas.includes(a)).map((area) => {
        const config = AREA_CONFIG[area];
        const active = selectedArea === area;
        return (
          <button
            key={area}
            type="button"
            data-testid={`area-filter-${area}`}
            onClick={() => setArea(area)}
            aria-pressed={active}
            className="rounded-sm border px-3 py-1.5 text-[12px] font-bold transition-all"
            style={
              active
                ? { background: config.color, color: "white", borderColor: config.color }
                : {
                    background: config.bg,
                    color: config.color,
                    borderColor: config.border,
                  }
            }
          >
            {area} — {["Salud", "Ciencias Básicas", "Ingenierías", "Económicas", "Humanidades"][AREAS.indexOf(area)]}
          </button>
        );
      })}
    </div>
  );
}
