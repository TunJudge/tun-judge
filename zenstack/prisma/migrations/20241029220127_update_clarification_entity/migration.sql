-- DropForeignKey
ALTER TABLE "Clarification" DROP CONSTRAINT "Clarification_problemId_fkey";

-- AddForeignKey
ALTER TABLE "Clarification" ADD CONSTRAINT "Clarification_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "ContestProblem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
