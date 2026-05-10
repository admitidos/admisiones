import { prisma, type Process } from "@admitidos/db";
import { deriveStatus, deriveAdmissionOption } from "./transform";
import { createManyChunked } from "../lib/db";
import type { UNMSMRow } from "../../universities/unmsm/shared/types";

export async function seedResults(
  rows: UNMSMRow[],
  processByPeriod: Map<string, Process>,
  applicantByProcessCode: Map<string, number>,
): Promise<void> {
  const data = rows.flatMap((row) => {
    const process = processByPeriod.get(row.process_id);
    if (!process) return [];
    const applicantId = applicantByProcessCode.get(`${process.id}:${row.code}`);
    if (applicantId === undefined) return [];
    return [{
      applicantId,
      score: row.score ?? 0,
      rank: row.rank ?? null,
      observation: row.observation,
      status: deriveStatus(row.observation),
      admissionOption: deriveAdmissionOption(row.observation),
      scrapedAt: new Date(row.scraped_at),
    }];
  });

  const inserted = await createManyChunked(prisma.unmsmResult, data);
  console.log(`✓ ${inserted.toLocaleString()} new results`);
}
