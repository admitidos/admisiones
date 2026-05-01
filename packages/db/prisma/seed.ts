import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const universities = [
  {
    name: "Universidad Nacional Mayor de San Marcos",
    acronym: "UNMSM",
    color: "#B91C1C",
    status: "active",
  },
  {
    name: "Universidad Nacional de Ingeniería",
    acronym: "UNI",
    color: "#1D4ED8",
    status: "coming_soon",
  },
  {
    name: "Universidad Nacional San Luis Gonzaga de Ica",
    acronym: "UNICA",
    color: "#15803D",
    status: "coming_soon",
  },
];

async function main() {
  for (const university of universities) {
    await prisma.university.upsert({
      where: { acronym: university.acronym },
      update: university,
      create: university,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
