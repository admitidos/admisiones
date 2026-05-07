import type { Metadata } from "next";
import { getCalendarData } from "@/features/calendar/getCalendarData";
import { CalendarClient } from "@/components/calendar/CalendarClient";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Próximos exámenes",
  description:
    "Fechas y jornadas de los próximos exámenes de admisión en universidades públicas del Perú.",
  openGraph: {
    title: "Próximos exámenes | admitidos.pe",
    description:
      "Prepárate a tiempo — consulta las fechas de admisión de San Marcos, UNI y más.",
    type: "website",
  },
};

export default async function ProximosExamenesPage() {
  const data = await getCalendarData();

  return (
    <>
      <main>
        <div
          className="relative overflow-hidden px-5 pb-12 pt-7 sm:px-8 sm:pb-13 sm:pt-9 lg:px-12 lg:pt-11"
          style={{ background: "var(--hero-bg)" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[-10px] right-[-20px] select-none whitespace-nowrap font-serif text-[110px] font-bold leading-none tracking-[-0.04em] text-white/[0.04] sm:text-[160px] lg:text-[200px]"
          >
            examenes
          </span>

          <div className="relative z-10">
            <h1 className="mb-1 font-serif text-[28px] font-bold tracking-[-0.03em] text-white sm:text-[36px] lg:text-[42px]">
              Próximos exámenes
            </h1>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Fechas y jornadas de los próximos exámenes de admisión
              <br className="hidden sm:block" />
              {" "}en universidades públicas del Perú.
            </p>
          </div>

          <div className="absolute bottom-[-1px] left-0 right-0 h-6 rounded-tl-[24px] rounded-tr-[24px] bg-background" />
        </div>

        <CalendarClient data={data} />
      </main>
      <Footer />
    </>
  );
}
