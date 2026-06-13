interface ModalidadBadgeProps {
  code: string;
  name: string;
}

export function ModalidadBadge({ code, name }: ModalidadBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted">
      <span className="font-bold text-foreground">{code}</span>
      <span>{name}</span>
    </span>
  );
}
