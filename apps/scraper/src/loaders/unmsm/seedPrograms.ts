import { prisma, type Career, type Process, type Program } from "@admitidos/db";
import { normalizeCareerName, normalizeCampus } from "./transform";
import type { UNMSMRow } from "../../universities/unmsm/shared/types";

export function programKey(processId: number, careerId: number, campus: string): string {
  return `${processId}:${careerId}:${campus}`;
}

type ProgramEntry = { processId: number; careerId: number; campus: string };

function collectUniquePrograms(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  careerByCode: Map<string, Career>,
): Map<string, ProgramEntry> {
  const unique = new Map<string, ProgramEntry>();
  for (const row of rows) {
    const name = normalizeCareerName(row.program_clean);
    if (!name) continue;
    const process = processByPeriod.get(row.process_id);
    const career = careerByCode.get(name);
    if (!process || !career) continue;
    const campus = normalizeCampus(row.campus);
    const key = programKey(process.id, career.id, campus);
    unique.set(key, { processId: process.id, careerId: career.id, campus });
  }
  return unique;
}

export async function seedPrograms(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  careerByCode: Map<string, Career>,
): Promise<Map<string, Program>> {
  const unique = collectUniquePrograms(rows, processByPeriod, careerByCode);

  for (const { processId, careerId, campus } of unique.values()) {
    await prisma.program.upsert({
      where: { processId_careerId_campus: { processId, careerId, campus } },
      update: {},
      create: { processId, careerId, campus },
    });
  }
  console.log(`✓ ${unique.size} programs`);

  const processIds = [...new Set([...unique.values()].map((p) => p.processId))];
  const programs = await prisma.program.findMany({ where: { processId: { in: processIds } } });
  return new Map(programs.map((p) => [programKey(p.processId, p.careerId, p.campus), p]));
}
