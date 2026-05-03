import type { ProcessStatus } from "@/features/home/getHomeData";

const CONFIG: Record<ProcessStatus, { label: string; bg: string; color: string }> = {
  new: { label: "Nuevo", bg: "#eef7f1", color: "#1c6b3a" },
  published: { label: "Publicado", bg: "#e0f2fe", color: "#0369a1" },
  upcoming: { label: "Próximo", bg: "#faf4e8", color: "#a86b1a" },
};

export function StatusBadge({ status }: { status: ProcessStatus }) {
  const { label, bg, color } = CONFIG[status];
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}
