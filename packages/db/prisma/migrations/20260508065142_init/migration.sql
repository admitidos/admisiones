-- CreateEnum
CREATE TYPE "ApplicantStatus" AS ENUM ('admitted', 'not_admitted', 'absent', 'disqualified');

-- CreateEnum
CREATE TYPE "AdmissionOption" AS ENUM ('first', 'second');

-- CreateTable
CREATE TABLE "universities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers" (
    "id" SERIAL NOT NULL,
    "universityId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT,
    "faculty" TEXT,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processes" (
    "id" SERIAL NOT NULL,
    "universityId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "examYear" INTEGER NOT NULL,
    "examSemester" TEXT NOT NULL,
    "totalApplicants" INTEGER,
    "totalAdmitted" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "regulationUrl" TEXT,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_dates" (
    "id" SERIAL NOT NULL,
    "processId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "area" TEXT,
    "examType" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "exam_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" SERIAL NOT NULL,
    "processId" INTEGER NOT NULL,
    "careerId" INTEGER NOT NULL,
    "campus" TEXT NOT NULL,
    "vacancies" INTEGER,
    "cutoffScore" DOUBLE PRECISION,
    "totalApplicants" INTEGER,
    "totalAdmitted" INTEGER,
    "admissionRate" DOUBLE PRECISION,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unmsm_processes" (
    "processId" INTEGER NOT NULL,
    "isPartialProcess" BOOLEAN NOT NULL,
    "hasAreas" BOOLEAN NOT NULL,
    "hasMinScoreFilter" BOOLEAN NOT NULL,
    "minScoreThreshold" INTEGER,
    "hasSecondChoice" BOOLEAN NOT NULL,

    CONSTRAINT "unmsm_processes_pkey" PRIMARY KEY ("processId")
);

-- CreateTable
CREATE TABLE "unmsm_modalities" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "examType" TEXT NOT NULL,

    CONSTRAINT "unmsm_modalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unmsm_process_modalities" (
    "processId" INTEGER NOT NULL,
    "modalityId" INTEGER NOT NULL,

    CONSTRAINT "unmsm_process_modalities_pkey" PRIMARY KEY ("processId","modalityId")
);

-- CreateTable
CREATE TABLE "unmsm_applicants" (
    "id" SERIAL NOT NULL,
    "processId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "modalityId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "campus" TEXT NOT NULL,

    CONSTRAINT "unmsm_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unmsm_results" (
    "id" SERIAL NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,
    "observation" TEXT NOT NULL,
    "status" "ApplicantStatus" NOT NULL,
    "admissionOption" "AdmissionOption",
    "scrapedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unmsm_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "universities_acronym_key" ON "universities"("acronym");

-- CreateIndex
CREATE INDEX "careers_universityId_area_idx" ON "careers"("universityId", "area");

-- CreateIndex
CREATE UNIQUE INDEX "careers_universityId_code_key" ON "careers"("universityId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "processes_universityId_slug_key" ON "processes"("universityId", "slug");

-- CreateIndex
CREATE INDEX "programs_processId_careerId_idx" ON "programs"("processId", "careerId");

-- CreateIndex
CREATE UNIQUE INDEX "programs_processId_careerId_campus_key" ON "programs"("processId", "careerId", "campus");

-- CreateIndex
CREATE UNIQUE INDEX "unmsm_modalities_code_key" ON "unmsm_modalities"("code");

-- CreateIndex
CREATE INDEX "unmsm_applicants_programId_idx" ON "unmsm_applicants"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "unmsm_applicants_processId_code_key" ON "unmsm_applicants"("processId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "unmsm_results_applicantId_key" ON "unmsm_results"("applicantId");

-- CreateIndex
CREATE INDEX "unmsm_results_score_idx" ON "unmsm_results"("score");

-- AddForeignKey
ALTER TABLE "careers" ADD CONSTRAINT "careers_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_dates" ADD CONSTRAINT "exam_dates_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "careers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_processes" ADD CONSTRAINT "unmsm_processes_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_process_modalities" ADD CONSTRAINT "unmsm_process_modalities_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_process_modalities" ADD CONSTRAINT "unmsm_process_modalities_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "unmsm_modalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_applicants" ADD CONSTRAINT "unmsm_applicants_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_applicants" ADD CONSTRAINT "unmsm_applicants_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_applicants" ADD CONSTRAINT "unmsm_applicants_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "unmsm_modalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unmsm_results" ADD CONSTRAINT "unmsm_results_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "unmsm_applicants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
