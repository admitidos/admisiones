import { title, subtitle } from "@/components/primitives";
import { SearchBar } from "@/components/search-bar";
import { ExamCard } from "@/components/exam-card";
import type { Exam } from "@/types/exam";

// Mock data - Replace with actual data from your API
const recentExams: Exam[] = [
  {
    id: "3",
    university: "PUCP - Pontificia Universidad Católica del Perú",
    examName: "Examen de Talento 2025-1",
    examDate: "17 marzo 2025",
    applicants: 18000,
    seats: 3500,
  },
  {
    id: "2",
    university: "UNI - Universidad Nacional de Ingeniería",
    examName: "Admisión 2025-1",
    examDate: "04 marzo 2025",
    applicants: 15000,
    seats: 2500,
  },
  {
    id: "1",
    university: "UNMSM - Universidad Nacional Mayor de San Marcos",
    examName: "Admisión 2025-1",
    examDate: "26 febrero 2025",
    applicants: 20000,
    seats: 4000,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 py-8 text-center md:py-12">
        <div className="flex flex-col items-center justify-center gap-8 max-w-3xl">
          <h1 className={title({ color: "green", size: "lg" })}>
            ¿Ingresaste?
          </h1>
          <h2 className={title({ size: "sm" })}>
            Conoce todos los resultados
            <br />
            de exámenes de admisión
          </h2>
          <div className={subtitle({ class: "mt-4" })}>
            Encuentra si has ingresado, analiza los resultados y mira las
            estadísticas por cada carrera de tu futura universidad.
          </div>
        </div>
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </section>

      {/* Recent Exams Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Últimos exámenes de admisión</h2>
        <div className="flex flex-col gap-4">
          {recentExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </section>
    </div>
  );
}
