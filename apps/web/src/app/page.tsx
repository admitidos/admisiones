import Link from "next/link";
import { getHomeData } from "@/features/home/getHomeData";
import { RecentProcesses } from "@/components/home/RecentProcesses";

const STATS = [
  { value: "128,400+", label: "Postulantes en la plataforma" },
  { value: "4",        label: "Universidades" },
  { value: "12",       label: "Procesos" },
  { value: "890+",     label: "Carreras" },
];

export default async function HomePage() {
  const { featuredProcess, processes } = await getHomeData();
  const uni = featuredProcess.university.acronym;
  const slug = featuredProcess.id.slice(uni.toLowerCase().length + 1);

  return (
    <main className="flex flex-1 flex-col">
      <section style={{ background: "var(--hero-bg)" }} className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.3) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-0 pt-16 md:px-8 md:pt-16">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col pb-16">
              <div
                className="mb-7 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
                style={{ background: "rgba(255,255,255,0.12)", color: "var(--hero-hi)" }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: "#4ade80", boxShadow: "0 0 0 3px #4ade8044" }}
                />
                Resultados {uni} {featuredProcess.name} publicados hoy
              </div>

              <h1 className="mb-5 font-serif text-5xl font-bold leading-[1.05] text-white md:text-[64px]">
                ¿Ingresaste?<br /><span style={{ color: "#cde0d5" }}>Descúbrelo ahora.</span>
              </h1>

              <p
                className="mb-9 max-w-[480px] text-lg leading-relaxed"
                style={{ color: "var(--hero-sub)" }}
              >
                No solo el puntaje — qué significa tu resultado, dónde quedaste frente a todos los postulantes, y a qué otras carreras habrías ingresado.
              </p>

              <Link
                href={`/${uni.toLowerCase()}/${slug}`}
                className="inline-flex w-fit items-center gap-3 rounded bg-white px-7 py-4 text-[17px] font-bold text-accent-dark transition-opacity hover:opacity-90"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
              >
                Ver resultados {uni} {featuredProcess.name}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9h12M11 4l5 5-5 5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="mt-2 w-full pb-8 lg:pb-16">
              <RecentProcesses processes={processes} />
            </div>
          </div>
        </div>

        <div style={{ background: "var(--hero-dim)", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 40 }}>
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="flex-1 py-5 text-center"
                  style={{ borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
                >
                  <div className="mb-0.5 font-serif text-[28px] font-bold text-white">{s.value}</div>
                  <div className="text-[13px]" style={{ color: "var(--hero-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
