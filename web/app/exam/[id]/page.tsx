import { notFound } from "next/navigation";
import { ExamDetailCard } from "@/components/exam-detail-card";
import { CareerListClient } from "@/components/career-list-client";
import type { Exam } from "@/types/exam";

// Mock data - Replace with actual API call
const mockExams: Record<string, Exam> = {
  "1": {
    id: "1",
    university: "Universidad Nacional Mayor de San Marcos",
    examName: "Admisión 2025-1",
    examDate: "17 marzo 2025",
    applicants: 20000,
    seats: 4000,
    careers: [
      {
        id: "1",
        code: "001",
        name: "Administración",
        applicants: 890,
        seats: 50,
      },
      {
        id: "2",
        code: "002",
        name: "Administración de la Gastronomía",
        applicants: 650,
        seats: 35,
      },
      {
        id: "3",
        code: "003",
        name: "Administración de Negocios Internacionales",
        applicants: 720,
        seats: 40,
      },
      {
        id: "4",
        code: "004",
        name: "Antropología",
        applicants: 450,
        seats: 30,
      },
      {
        id: "5",
        code: "005",
        name: "Bibliotecología y Ciencias de la Información",
        applicants: 320,
        seats: 25,
      },
      {
        id: "6",
        code: "006",
        name: "Ciencias Biológicas",
        applicants: 980,
        seats: 60,
      },
      {
        id: "7",
        code: "007",
        name: "Computación Científica",
        applicants: 1200,
        seats: 45,
      },
      {
        id: "8",
        code: "008",
        name: "Contabilidad",
        applicants: 850,
        seats: 55,
      },
      { id: "9", code: "009", name: "Derecho", applicants: 1500, seats: 70 },
      { id: "10", code: "010", name: "Economía", applicants: 920, seats: 50 },
    ],
  },
  "2": {
    id: "2",
    university: "UNI - Universidad Nacional de Ingeniería",
    examName: "Admisión 2025-1",
    examDate: "04 marzo 2025",
    applicants: 15000,
    seats: 2500,
    careers: [
      {
        id: "1",
        code: "001",
        name: "Ingeniería Civil",
        applicants: 1800,
        seats: 80,
      },
      {
        id: "2",
        code: "002",
        name: "Ingeniería Mecánica",
        applicants: 1200,
        seats: 60,
      },
      {
        id: "3",
        code: "003",
        name: "Ingeniería Eléctrica",
        applicants: 950,
        seats: 50,
      },
      {
        id: "4",
        code: "004",
        name: "Ingeniería Electrónica",
        applicants: 1100,
        seats: 55,
      },
      {
        id: "5",
        code: "005",
        name: "Ingeniería de Sistemas",
        applicants: 2100,
        seats: 90,
      },
    ],
  },
  "3": {
    id: "3",
    university: "PUCP - Pontificia Universidad Católica del Perú",
    examName: "Examen de Talento 2025-1",
    examDate: "26 febrero 2025",
    applicants: 18000,
    seats: 3500,
    careers: [
      {
        id: "1",
        code: "001",
        name: "Administración",
        applicants: 780,
        seats: 45,
      },
      {
        id: "2",
        code: "002",
        name: "Arquitectura",
        applicants: 920,
        seats: 50,
      },
      { id: "3", code: "003", name: "Derecho", applicants: 1450, seats: 65 },
      { id: "4", code: "004", name: "Economía", applicants: 850, seats: 48 },
      {
        id: "5",
        code: "005",
        name: "Ingeniería Civil",
        applicants: 1320,
        seats: 70,
      },
    ],
  },
};

// Add metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = mockExams[id];

  if (!exam) {
    return {
      title: "Examen no encontrado",
    };
  }

  return {
    title: `${exam.examName} - ${exam.university}`,
    description: `Resultados del ${exam.examName} de ${exam.university}. ${exam.applicants} postulantes, ${exam.seats} vacantes.`,
  };
}

// Enable static generation for known IDs
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // In production, this would be an async API call
  const exam = mockExams[id];

  if (!exam) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <ExamDetailCard exam={exam} />
      <CareerListClient careers={exam.careers || []} examId={id} />
    </div>
  );
}
