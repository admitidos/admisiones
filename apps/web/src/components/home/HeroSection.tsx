import Link from "next/link";
import type { HomeFeaturedProcess } from "@/features/home/getHomeData";

function processHref(p: HomeFeaturedProcess): string {
  const uni = p.university.acronym.toLowerCase();
  return `/${uni}/${p.id.slice(uni.length + 1)}`;
}

export function HeroSection({ featuredProcess: p }: { featuredProcess: HomeFeaturedProcess }) {
  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden"
      aria-label="Último examen disponible"
      style={{ background: "var(--hero-bg)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 translate-y-[-60%] select-none whitespace-nowrap font-serif text-[120px] font-bold leading-none tracking-[-0.04em] text-white/4 sm:text-[200px]"
      >
        admitidos
      </span>

      <div className="relative z-10 mx-auto max-w-180 px-4 pt-8 text-center sm:pt-13">
        <div
          className="mb-4.5 inline-flex items-center gap-1.75 rounded-full border border-white/20 px-3.5 py-1.25"
          style={{ background: "rgba(255,255,255,0.14)" }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-white">
            Resultados disponibles
          </span>
        </div>

        <h1 className="mb-3 font-serif text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[42px]">
          Consulta tu resultado
          <br />
          de admisión
        </h1>

        <p
          className="mb-8 text-[15px] leading-relaxed sm:mb-9 sm:text-[16px]"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          No solo tu puntaje — entiende qué significa
          <br className="hidden sm:block" /> y a qué otras carreras habrías ingresado.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-0 max-w-170 px-4 sm:px-0">
        <div
          className="overflow-hidden rounded-tl-[20px] rounded-tr-[20px] border border-b-0 border-border bg-white"
          style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
        >
          <div className="flex items-center justify-between border-b border-green-200 bg-green-50 px-6 py-2.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-green-900">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600" />
              Último examen publicado
            </span>
            <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em] text-green-900">
              Nuevo
            </span>
          </div>

          <div className="px-6 pb-5 pt-6">
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-green-600">
              {p.university.acronym} · {p.university.shortName}
            </p>
            <h2 className="mb-1 font-serif text-2xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-[26px]">
              Admisión {p.name} · EBR / EBA
            </h2>
            <p className="mb-5 text-[13px] text-muted">{p.subtitle}</p>

            <div className="mb-5 overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-4 divide-x divide-border">
                {(
                  [
                    { val: p.stats.applicants, lbl: "postulantes" },
                    { val: p.stats.vacancies, lbl: "vacantes" },
                    { val: p.stats.programs, lbl: "carreras" },
                    { val: p.stats.admissionRate, lbl: "tasa ingreso" },
                  ] as const
                ).map((s) => (
                  <div key={s.lbl} className="py-3 text-center">
                    <div className="font-serif text-base font-bold leading-none tracking-[-0.02em] text-foreground sm:text-[20px]">
                      {s.val}
                    </div>
                    <div className="mt-0.5 text-[10px] font-medium text-muted">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={processHref(p)}
              className="flex w-full items-center justify-between rounded-xl px-5 py-3.75 text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--hero-bg)" }}
            >
              <span className="text-[14px] font-bold tracking-[-0.01em]">
                Ver resultados de este examen
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-white/20">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
