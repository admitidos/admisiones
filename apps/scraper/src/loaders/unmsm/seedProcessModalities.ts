import { prisma, type Process, type UnmsmModality } from "@admitidos/db";
import type { UNMSMRow } from "../../universities/unmsm/shared/types";

type ModalityPair = { processId: number; modalityId: number };

function collectUniquePairs(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  modalityByCode: Map<string, UnmsmModality>,
): Map<string, ModalityPair> {
  const unique = new Map<string, ModalityPair>();
  for (const row of rows) {
    const process = processByPeriod.get(row.process_id);
    const modality = modalityByCode.get(row.modality);
    if (!process || !modality) continue;
    unique.set(`${process.id}:${modality.id}`, { processId: process.id, modalityId: modality.id });
  }
  return unique;
}

export async function seedProcessModalities(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  modalityByCode: Map<string, UnmsmModality>,
): Promise<void> {
  const unique = collectUniquePairs(rows, processByPeriod, modalityByCode);

  for (const { processId, modalityId } of unique.values()) {
    await prisma.unmsmProcessModality.upsert({
      where: { processId_modalityId: { processId, modalityId } },
      update: {},
      create: { processId, modalityId },
    });
  }
  console.log(`✓ ${unique.size} process-modality links`);
}
