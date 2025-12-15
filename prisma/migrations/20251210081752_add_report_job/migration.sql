-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('queued', 'fetching_data', 'generating_structure', 'generating_chunks', 'merging_and_cleaning', 'completed', 'failed');

-- CreateTable
CREATE TABLE "report_jobs" (
    "id" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'queued',
    "finalPdfPath" TEXT,
    "chunkPaths" TEXT,
    "requestBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "report_jobs_pkey" PRIMARY KEY ("id")
);
