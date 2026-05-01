import { prisma } from "@admitidos/db";

export async function findUniversities(search?: string) {
  return prisma.university.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { acronym: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
  });
}
