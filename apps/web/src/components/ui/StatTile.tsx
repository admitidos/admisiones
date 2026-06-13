interface StatTileProps {
  value: string;
  label: string;
  sublabel?: string;
  accent?: boolean;
}

export function StatTile({ value, label, sublabel, accent = false }: StatTileProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`font-serif text-2xl font-bold leading-none tracking-tight sm:text-3xl ${accent ? "text-accent" : "text-foreground"}`}
      >
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {sublabel && <span className="text-[11px] text-muted">{sublabel}</span>}
    </div>
  );
}
