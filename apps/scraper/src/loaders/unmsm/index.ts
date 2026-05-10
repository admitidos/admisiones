import { prisma } from "@admitidos/db";
import type { UniversitySeeder } from "../types";
import { loadRows } from "./loadRows";
import { normalizeCareerName } from "./transform";
import { seedCareers } from "./seedCareers";
import { seedPrograms } from "./seedPrograms";
import { seedProcessModalities } from "./seedProcessModalities";
import { seedApplicants } from "./seedApplicants";
import { seedResults } from "./seedResults";
import { computeProgramStats, computeProcessTotals } from "./computeStats";

export class UnmsmSeeder implements UniversitySeeder {
  async seed(): Promise<void> {
    const unmsm = await prisma.university.findUniqueOrThrow({ where: { acronym: "UNMSM" } });

    const processes = await prisma.process.findMany({ where: { universityId: unmsm.id } });
    const processByPeriod = new Map(processes.map((p) => [p.period, p]));

    const modalities = await prisma.unmsmModality.findMany();
    const modalityByCode = new Map(modalities.map((m) => [m.code, m]));

    console.log("Loading CSV rows…");
    const rows = loadRows();
    console.log(`  ${rows.length.toLocaleString()} rows across all processes`);

    const careerNames = new Set(
      rows.map((r) => normalizeCareerName(r.program_clean)).filter(Boolean),
    );

    const careerByCode = await seedCareers(unmsm.id, careerNames);
    const programByKey = await seedPrograms(rows, processByPeriod, careerByCode);
    await seedProcessModalities(rows, processByPeriod, modalityByCode);
    const applicantByProcessCode = await seedApplicants(rows, processByPeriod, careerByCode, programByKey, modalityByCode);
    await seedResults(rows, processByPeriod, applicantByProcessCode);

    console.log("Computing stats…");
    const processIds = processes.map((p) => p.id);
    await computeProgramStats(processIds);
    await computeProcessTotals(processIds);
  }
}
