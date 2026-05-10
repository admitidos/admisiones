import { prisma, type Career, type Process, type Program, type UnmsmModality } from "@admitidos/db";
import { normalizeCareerName, normalizeCampus } from "./transform";
import { programKey } from "./seedPrograms";
import { createManyChunked } from "../lib/db";
import type { UNMSMRow } from "../../universities/unmsm/shared/types";

type ApplicantRecord = {
  processId: number;
  programId: number;
  modalityId: number;
  code: string;
  fullName: string;
  campus: string;
};

function buildApplicantRecords(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  careerByCode: Map<string, Career>,
  programByKey: Map<string, Program>,
  modalityByCode: Map<string, UnmsmModality>,
): ApplicantRecord[] {
  return rows.flatMap((row) => {
    const name = normalizeCareerName(row.program_clean);
    if (!name) return [];
    const process = processByPeriod.get(row.process_id);
    const career = careerByCode.get(name);
    const modality = modalityByCode.get(row.modality);
    if (!process || !career || !modality) return [];
    const campus = normalizeCampus(row.campus);
    const program = programByKey.get(programKey(process.id, career.id, campus));
    if (!program) return [];
    return [{ processId: process.id, programId: program.id, modalityId: modality.id, code: row.code, fullName: row.full_name, campus }];
  });
}

export async function seedApplicants(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  careerByCode: Map<string, Career>,
  programByKey: Map<string, Program>,
  modalityByCode: Map<string, UnmsmModality>,
): Promise<Map<string, number>> {
  const data = buildApplicantRecords(rows, processByPeriod, careerByCode, programByKey, modalityByCode);
  const inserted = await createManyChunked(prisma.unmsmApplicant, data);
  console.log(`✓ ${inserted.toLocaleString()} new applicants (${data.length.toLocaleString()} total)`);

  const processIds = [...new Set(data.map((d) => d.processId))];
  const all = await prisma.unmsmApplicant.findMany({
    where: { processId: { in: processIds } },
    select: { id: true, processId: true, code: true },
  });
  return new Map(all.map((a) => [`${a.processId}:${a.code}`, a.id]));
}
