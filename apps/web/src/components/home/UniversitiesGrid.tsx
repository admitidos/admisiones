import type { HomeUniversity } from "@/features/home/getHomeData";

function UnmsmIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="21" cy="21" r="19" stroke="#15803D" strokeWidth="2.5" fill="none" />
      <circle cx="21" cy="21" r="13" stroke="#15803D" strokeWidth="1.5" fill="none" />
      <path d="M21 8 L21 34" stroke="#15803D" strokeWidth="1.5" />
      <path d="M8 21 L34 21" stroke="#15803D" strokeWidth="1.5" />
      <path d="M11.5 11.5 L30.5 30.5" stroke="#15803D" strokeWidth="1" />
      <path d="M30.5 11.5 L11.5 30.5" stroke="#15803D" strokeWidth="1" />
      <circle cx="21" cy="21" r="3.5" fill="#15803D" />
    </svg>
  );
}

function UniIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="3" width="36" height="36" rx="4" stroke="#B45309" strokeWidth="2.5" fill="none" />
      <path d="M10 14 L10 28" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 14 L21 28" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 14 L21 28" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 14 L32 28" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 14 L32 14" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ComingSoonIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 4 L38 32 L4 32 Z" stroke="#6B7280" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M21 14 L21 24" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="28" r="1.5" fill="#6B7280" />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  UNMSM: <UnmsmIcon />,
  UNI: <UniIcon />,
};

export function UniversitiesGrid({ universities }: { universities: HomeUniversity[] }) {
  return (
    <section data-testid="universities-grid" aria-label="Universidades">
      <p className="mb-3 px-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
        Universidades
      </p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {universities.map((u) => {
          const active = u.status === "active";
          return (
            <div
              key={u.acronym}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-[16px] border-[1.5px] border-border bg-white p-5 transition-all ${
                active
                  ? "cursor-pointer hover:border-green-600 hover:shadow-[0_4px_20px_rgba(21,128,61,0.1)]"
                  : "cursor-default opacity-45"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center transition-[filter] duration-200 ${
                  active
                    ? "brightness-[0.6] grayscale group-hover:brightness-100 group-hover:grayscale-0"
                    : "brightness-50 grayscale"
                }`}
              >
                {ICONS[u.acronym] ?? <ComingSoonIcon />}
              </div>
              <div>
                <div
                  className="mb-0.5 font-serif text-base font-bold"
                  style={{ color: active ? "var(--foreground)" : "var(--muted)" }}
                >
                  {u.acronym}
                </div>
                <div className="text-xs leading-snug text-muted">
                  {u.name} · {u.location}
                </div>
                <div
                  className="mt-1.5 text-[11px] font-semibold"
                  style={{ color: active ? "var(--g600)" : "var(--muted)" }}
                >
                  {active ? `${u.examCount} exámenes disponibles` : "Próximamente"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
