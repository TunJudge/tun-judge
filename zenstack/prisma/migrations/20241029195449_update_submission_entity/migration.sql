/*
  Warnings:

  - Made the column `color` on table `ContestProblem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_problemId_fkey";

-- AlterTable
ALTER TABLE "ContestProblem" ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "color" SET NOT NULL,
ADD CONSTRAINT "ContestProblem_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "ContestProblem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
