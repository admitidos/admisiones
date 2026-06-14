import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getResultData } from "@/features/result/getResultData";
import { buildResultMetadata } from "@/lib/utils/seo";
import { ScoreHero } from "@/components/result/ScoreHero";
import { PositionBar } from "@/components/result/PositionBar";
import { ScoreDistributionBar } from "@/components/result/ScoreDistributionBar";
import { CutoffHistoryChart } from "@/components/result/CutoffHistoryChart";
import { ReachableProgramsList } from "@/components/result/ReachableProgramsList";
import { ShareButton } from "@/components/result/ShareButton";
import { StatTile } from "@/components/ui/StatTile";
import { formatRate } from "@/lib/utils/formatters";
import type { Area } from "@/features/process/getProcessData";

const CODE_RE = /^\d{6}$/;

interface PageProps {
  params: Promise<{ university: string; process: string; code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { university, process: processSlug, code } = await params;
  if (!CODE_RE.test(code)) return {};
  const data = await getResultData({ universityAcronym: university.toUpperCase(), processSlug, applicantCode: code });
  if (!data) return {};
  return buildResultMetadata({
    fullName: data.applicant.fullName,
    score: data.result.score,
    programName: data.program.name,
    universityAcronym: data.university.acronym,
    processPeriod: data.process.period,
    admitted: data.result.status === "admitted",
  });
}

export default async function ResultPage({ params }: PageProps) {
  const { university, process: processSlug, code } = await params;

  if (!CODE_RE.test(code)) notFound();

  const data = await getResultData({
    universityAcronym: university.toUpperCase(),
    processSlug,
    applicantCode: code,
  });

  if (!data) notFound();

  const { applicant, result, program, modality, process, university: uni, computed } = data;
  const minScore = Math.min(...computed.scoreDistribution);
  const maxScore = Math.max(...computed.scoreDistribution);

  return (
    <main>
      <ScoreHero
        fullName={applicant.fullName}
        applicantCode={applicant.code}
        score={result.score}
        status={result.status}
        rank={result.rank}
        programName={program.name}
        campus={program.campus}
        area={program.area as Area | null}
        modality={modality}
        university={uni}
        process={process}
        computed={{
          pointsToAdmission: computed.pointsToAdmission,
          percentileInProgram: computed.percentileInProgram,
          percentileInArea: computed.percentileInArea,
          totalApplicants: computed.totalApplicants,
          totalAdmitted: computed.totalAdmitted,
        }}
      />

      <div className="mx-auto max-w-180 px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-8 lg:px-12">
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-white px-4 py-4">
            <StatTile
              value={computed.totalApplicants.toLocaleString("es-PE")}
              label="Postulantes"
            />
          </div>
          <div className="rounded-lg border border-border bg-white px-4 py-4">
            <StatTile
              value={computed.totalAdmitted.toLocaleString("es-PE")}
              label="Ingresantes"
            />
          </div>
          <div className="rounded-lg border border-border bg-white px-4 py-4">
            <StatTile
              value={computed.cutoffScore?.toLocaleString("es-PE") ?? "—"}
              label="Puntaje de corte"
            />
          </div>
          <div className="rounded-lg border border-border bg-white px-4 py-4">
            <StatTile
              value={computed.admissionRate !== null ? formatRate(computed.admissionRate) : "—"}
              label="Tasa de ingreso"
            />
          </div>
        </div>

        <div className="mb-5">
          <PositionBar
            score={result.score}
            cutoffScore={computed.cutoffScore}
            minScore={minScore}
            maxScore={maxScore}
            percentile={computed.percentileInProgram}
            universityColor={uni.color}
          />
        </div>

        <div className="mb-5">
          <ScoreDistributionBar
            scores={computed.scoreDistribution}
            applicantScore={result.score}
            cutoffScore={computed.cutoffScore}
            universityColor={uni.color}
            totalApplicants={computed.totalApplicants}
          />
        </div>

        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          <CutoffHistoryChart
            historicalCutoffs={computed.historicalCutoffs}
            currentScore={result.score}
            tendency={computed.cutoffTendency}
            programName={program.name}
            universityColor={uni.color}
          />

          <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-muted">
                {result.status === "admitted" ? "Comparte tu logro" : "Comparte tu resultado"}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                {result.status === "admitted"
                  ? "¡Felicitaciones! Comparte tus resultados con tu familia y amigos."
                  : "Comparte tu resultado y consulta con quienes ya pasaron por esto."}
              </p>
            </div>
            <ShareButton
              title={`${applicant.fullName} — ${program.name} ${uni.acronym} ${process.period}`}
              text={
                result.status === "admitted"
                  ? `¡Ingresé a ${program.name} en ${uni.acronym}! Consulta los resultados en admisiones`
                  : `Mis resultados de ${uni.acronym} ${process.period} en admisiones`
              }
            />
          </div>
        </div>

        {computed.reachablePrograms.length > 0 && (
          <ReachableProgramsList
            programs={computed.reachablePrograms}
            currentProgramId={program.name}
            universityAcronym={uni.acronym}
            processSlug={process.slug}
          />
        )}
      </div>
    </main>
  );
}
