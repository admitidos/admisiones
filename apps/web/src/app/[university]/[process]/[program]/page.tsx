import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProcessData } from "@/features/process/getProcessData";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AreaChip } from "@/components/ui/AreaChip";
import { ModalidadBadge } from "@/components/ui/ModalidadBadge";
import { ApplicantTable } from "@/components/process/ApplicantTable";
import { formatScore, formatRate } from "@/lib/utils/formatters";
import type { Area } from "@/features/process/getProcessData";

interface PageProps {
  params: Promise<{ university: string; process: string; program: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { university, process: processSlug, program: programId } = await params;
  const data = await getProcessData({ universityAcronym: university.toUpperCase(), processSlug });
  const prog = data?.programs.find((p) => p.id === programId);
  if (!prog || !data) return {};
  const title = `${prog.name} — ${data.university.acronym} ${data.process.period} | Listado de postulantes`;
  return {
    title,
    description: `${prog.totalApplicants} postulantes · Corte ${prog.cutoffScore ?? "—"} · ${prog.totalAdmitted} ingresantes`,
  };
}

export default async function ProgramPage({ params }: PageProps) {
  const { university, process: processSlug, program: programId } = await params;
  const data = await getProcessData({ universityAcronym: university.toUpperCase(), processSlug });

  if (!data) notFound();

  const program = data.programs.find((p) => p.id === programId);
  if (!program) notFound();

  return (
    <main>
      <section
        className="px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6 lg:px-12"
        style={{ background: "var(--hero-bg)" }}
      >
        <div className="mx-auto max-w-180">
          <Breadcrumb
            light
            items={[
              { label: data.university.acronym, href: `/${university}` },
              { label: `Admisión ${data.process.period}`, href: `/${university}/${processSlug}` },
              { label: program.name },
            ]}
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {program.area && <AreaChip area={program.area as Area} size="md" />}
            <ModalidadBadge code={program.modalityCode} name={program.modalityName} />
          </div>

          <h1 className="mt-3 font-serif text-[24px] font-bold leading-tight tracking-tight text-white sm:text-[30px]">
            {program.name}
            {program.campus ? ` — ${program.campus}` : ""}
          </h1>
          <p className="mt-1 text-[13px] text-white/70">
            Encuentra tu código de postulación para ver tu resultado completo.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            {[
              { label: "Corte", value: program.cutoffScore !== null ? formatScore(program.cutoffScore) : "—" },
              { label: "Vacantes", value: String(program.vacancies) },
              { label: "Postulantes", value: program.totalApplicants.toLocaleString("es-PE") },
              { label: "Tasa", value: program.admissionRate !== null ? formatRate(program.admissionRate) : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-sm bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
                <div className="font-serif text-[20px] font-bold leading-none text-white">{value}</div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-180 px-5 pb-16 pt-7 sm:px-8 lg:px-12">
        <ApplicantTable
          applicants={program.applicants}
          cutoffScore={program.cutoffScore}
          universityAcronym={data.university.acronym}
          processSlug={processSlug}
          universityColor={data.university.color}
        />
      </div>
    </main>
  );
}
