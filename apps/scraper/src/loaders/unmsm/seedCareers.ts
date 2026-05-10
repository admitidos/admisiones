import { prisma, type Career } from "@admitidos/db";
import { CAREER_AREA } from "./constants";

export async function seedCareers(universityId: number, careerNames: Set<string>): Promise<Map<string, Career>> {
  for (const name of careerNames) {
    await prisma.career.upsert({
      where: { universityId_code: { universityId, code: name } },
      update: { name, area: CAREER_AREA[name] ?? null },
      create: { universityId, code: name, name, area: CAREER_AREA[name] ?? null },
    });
  }
  console.log(`✓ ${careerNames.size} careers`);

  const careers = await prisma.career.findMany({ where: { universityId } });
  return new Map(careers.map((c) => [c.code, c]));
}
