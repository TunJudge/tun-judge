-- DropForeignKey
ALTER TABLE "ScoreCache" DROP CONSTRAINT "ScoreCache_problemId_fkey";

-- AddForeignKey
ALTER TABLE "ScoreCache" ADD CONSTRAINT "ScoreCache_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "ContestProblem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
