import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getProcessData } from "@/features/process/getProcessData";
import { buildProcessMetadata } from "@/lib/utils/seo";
import { ProcessHeader } from "@/components/process/ProcessHeader";
import { AreaFilter } from "@/components/process/AreaFilter";
import { ProgramTable } from "@/components/process/ProgramTable";
import { pipe, map, filter, unique } from "remeda";
import type { Area } from "@/features/process/getProcessData";

interface PageProps {
  params: Promise<{ university: string; process: string }>;
  searchParams: Promise<{ area?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { university, process: processSlug } = await params;
  const data = await getProcessData({
    universityAcronym: university.toUpperCase(),
    processSlug,
  });
  if (!data) return {};
  return buildProcessMetadata({
    universityAcronym: data.university.acronym,
    processPeriod: data.process.period,
    programCount: data.stats.programCount,
  });
}

export default async function ProcessPage({ params, searchParams }: PageProps) {
  const { university, process: processSlug } = await params;
  const { area } = await searchParams;
  const data = await getProcessData({
    universityAcronym: university.toUpperCase(),
    processSlug,
  });

  if (!data) notFound();

  const selectedArea = (["A", "B", "C", "D", "E"].includes(area ?? "") ? area : null) as Area | null;

  const availableAreas = pipe(
    data.programs,
    map((p) => p.area),
    filter((a): a is Area => a !== null),
    unique(),
  );

  return (
    <main className="animate-fade-in-up">
      <ProcessHeader
        university={data.university}
        process={data.process}
        stats={data.stats}
      />

      <div className="mx-auto max-w-180 px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="mb-6">
          <Suspense>
            <AreaFilter availableAreas={availableAreas} selectedArea={selectedArea} />
          </Suspense>
        </div>

        <ProgramTable
          programs={data.programs}
          selectedArea={selectedArea}
          universityAcronym={data.university.acronym}
          processSlug={data.process.slug}
          universityColor={data.university.color}
        />
      </div>
    </main>
  );
}
