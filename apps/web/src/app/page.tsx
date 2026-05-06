import type { Metadata } from "next";
import { getHomeData } from "@/features/home/getHomeData";
import { HeroSection } from "@/components/home/HeroSection";
import { PastExamsSection } from "@/components/home/PastExamsSection";
import { UniversitiesGrid } from "@/components/home/UniversitiesGrid";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "admitidos.pe — Resultados de admisión universitaria",
  description:
    "Consulta tu resultado de admisión en universidades públicas del Perú. No solo el puntaje — qué significa y a qué otras carreras habrías ingresado.",
  openGraph: {
    title: "admitidos.pe — Resultados de admisión universitaria",
    description:
      "No solo tu puntaje — entiende qué significa y a qué otras carreras habrías ingresado.",
    type: "website",
  },
};

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <main>
        <HeroSection featuredProcess={data.featuredProcess} />
        <div className="mx-auto max-w-170 px-4 pb-16 sm:px-0">
          <PastExamsSection processes={data.pastProcesses} />
          <div className="mt-8">
            <UniversitiesGrid universities={data.universities} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
