"use client";

import { useState } from "react";
import Link from "next/link";
import type { HomePastProcess } from "@/features/home/getHomeData";

type Filter = "all" | "UNMSM" | "UNI";

function processHref(p: HomePastProcess): string {
  const uni = p.university.acronym.toLowerCase();
  return `/${uni}/${p.id.slice(uni.length + 1)}`;
}

export function PastExamsSection({ processes }: { processes: HomePastProcess[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? processes : processes.filter((p) => p.university.acronym === filter);

  return (
    <section
      aria-label="Exámenes pasados"
      className="overflow-hidden rounded-b-[16px] border border-t-0 border-border bg-white"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-3.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
          Exámenes pasados
        </span>
        <div className="flex gap-1" role="group" aria-label="Filtrar por universidad">
          {(["all", "UNMSM", "UNI"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
                filter === f
                  ? "border-foreground bg-foreground text-white"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todos" : f}
            </button>
          ))}
        </div>
      </div>

      {visible.map((p) => (
        <Link
          key={p.id}
          href={processHref(p)}
          className="flex items-center gap-4 border-b border-border px-6 py-3.5 transition-colors last:border-b-0 hover:bg-background"
        >
          <div
            className="w-15 shrink-0 font-serif text-sm font-bold"
            style={{ color: p.university.color }}
          >
            {p.university.acronym}
          </div>
          <div className="h-8 w-px shrink-0 bg-border" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-foreground">{p.name}</div>
            <div className="mt-0.5 truncate text-xs text-muted">{p.subtitle}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs font-semibold text-muted">{p.date}</div>
            <span className="mt-0.5 inline-block rounded-full border border-border bg-background px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em] text-muted">
              Publicado
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
