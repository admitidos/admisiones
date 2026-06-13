import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  light?: boolean;
}

export function Breadcrumb({ items, light = false }: BreadcrumbProps) {
  const textClass = light ? "text-white/70" : "text-muted";
  const linkClass = light
    ? "text-white/80 hover:text-white"
    : "text-muted hover:text-foreground";

  return (
    <nav aria-label="Navegación de ruta" className="flex flex-wrap items-center gap-1.5">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className={`text-[11px] ${textClass}`} aria-hidden="true">
              ›
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={`text-[12px] font-medium transition-colors ${linkClass}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`text-[12px] font-medium ${textClass}`} aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
