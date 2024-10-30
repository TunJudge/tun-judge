-- AlterTable
ALTER TABLE "JudgingRun" ALTER COLUMN "runOutputFileName" DROP NOT NULL,
ALTER COLUMN "errorOutputFileName" DROP NOT NULL,
ALTER COLUMN "checkerOutputFileName" DROP NOT NULL;
