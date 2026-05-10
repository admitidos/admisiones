import { prisma } from "@admitidos/db";

export async function computeProgramStats(processIds: number[]): Promise<void> {
  const programs = await prisma.program.findMany({
    where: { processId: { in: processIds } },
    select: { id: true },
  });

  for (const { id } of programs) {
    const applicants = await prisma.unmsmApplicant.findMany({
      where: { programId: id },
      include: { result: true },
    });

    const totalApplicants = applicants.length;
    const admitted = applicants.filter((a) => a.result?.status === "admitted");
    const totalAdmitted = admitted.length;
    const scores = admitted.map((a) => a.result!.score).filter((s) => s > 0);
    const cutoffScore = scores.length > 0 ? Math.min(...scores) : null;
    const admissionRate = totalApplicants > 0 ? totalAdmitted / totalApplicants : null;

    await prisma.program.update({
      where: { id },
      data: { totalApplicants, totalAdmitted, cutoffScore, admissionRate },
    });
  }
  console.log(`✓ stats computed for ${programs.length} programs`);
}

export async function computeProcessTotals(processIds: number[]): Promise<void> {
  for (const processId of processIds) {
    const [{ _count: totalApplicants }] = await prisma.$queryRaw<[{ _count: bigint }]>`
      SELECT COUNT(*)::bigint AS "_count" FROM unmsm_applicants WHERE "processId" = ${processId}
    `;
    const [{ _count: totalAdmitted }] = await prisma.$queryRaw<[{ _count: bigint }]>`
      SELECT COUNT(*)::bigint AS "_count"
      FROM unmsm_applicants a
      JOIN unmsm_results r ON r."applicantId" = a.id
      WHERE a."processId" = ${processId} AND r.status = 'admitted'
    `;
    await prisma.process.update({
      where: { id: processId },
      data: { totalApplicants: Number(totalApplicants), totalAdmitted: Number(totalAdmitted) },
    });
  }
  console.log(`✓ totals computed for ${processIds.length} processes`);
}
