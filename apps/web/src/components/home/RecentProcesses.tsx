import Link from "next/link";
import type { HomeProcess } from "@/features/home/getHomeData";
import { StatusBadge } from "@/components/ui/StatusBadge";

function processHref(p: HomeProcess): string {
  const uni = p.university.acronym.toLowerCase();
  return `/${uni}/${p.id.slice(uni.length + 1)}`;
}

export function RecentProcesses({ processes }: { processes: HomeProcess[] }) {
  return (
    <div className="rounded bg-white p-6" style={{ boxShadow: "var(--shadow-lg)" }}>
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">
        Últimos exámenes
      </p>
      <div className="flex flex-col gap-2">
        {processes.map((p, i) => (
          <Link
            key={p.id}
            href={processHref(p)}
            className={`flex items-center gap-3 rounded-sm px-3.5 py-3 transition-colors hover:bg-green-50 ${
              i === 0
                ? "border border-green-200 bg-green-50"
                : "border border-transparent hover:border-green-100"
            }`}
          >
            <div
              className="h-9 w-1.5 shrink-0 rounded-full"
              style={{ background: p.university.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-2">
                <span className="text-sm font-bold">{p.university.acronym}</span>
                <span className="text-xs text-muted">{p.name}</span>
              </div>
              <span className="text-xs text-muted">{p.date}</span>
            </div>
            <StatusBadge status={p.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
