-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('FILE', 'DIRECTORY');

-- CreateEnum
CREATE TYPE "ExecutableType" AS ENUM ('RUNNER', 'CHECKER');

-- CreateEnum
CREATE TYPE "JudgingRunResult" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR');

-- CreateEnum
CREATE TYPE "JudgingResult" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR', 'SYSTEM_ERROR');

-- CreateTable
CREATE TABLE "InitialDataEntity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "InitialDataEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "lastLogin" TIMESTAMP(3),
    "lastIpAddress" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sessionId" TEXT,
    "roleName" TEXT NOT NULL,
    "teamId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "room" TEXT,
    "comments" TEXT,
    "penalty" INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamContest" (
    "teamId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TeamCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#ffffff',
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TeamCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "activateTime" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "freezeTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "unfreezeTime" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "processBalloons" BOOLEAN NOT NULL DEFAULT false,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "openToAllTeams" BOOLEAN NOT NULL DEFAULT false,
    "verificationRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "timeLimit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "memoryLimit" INTEGER NOT NULL DEFAULT 2097152,
    "outputLimit" INTEGER NOT NULL DEFAULT 8192,
    "statementFileName" TEXT NOT NULL,
    "runScriptId" INTEGER NOT NULL,
    "checkScriptId" INTEGER NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestProblem" (
    "contestId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "shortName" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "allowSubmit" BOOLEAN NOT NULL DEFAULT true,
    "allowJudge" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "File" (
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "md5Sum" TEXT NOT NULL,
    "kind" "FileKind" NOT NULL DEFAULT 'FILE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,
    "parentDirectoryName" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Executable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "dockerImage" TEXT,
    "type" "ExecutableType" NOT NULL,
    "sourceFileName" TEXT NOT NULL,
    "buildScriptName" TEXT NOT NULL,

    CONSTRAINT "Executable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testcase" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "rank" INTEGER NOT NULL,
    "sample" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "inputFileName" TEXT NOT NULL,
    "outputFileName" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "Testcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JudgingRun" (
    "id" SERIAL NOT NULL,
    "result" "JudgingRunResult" NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "runTime" DOUBLE PRECISION NOT NULL,
    "runMemory" DOUBLE PRECISION NOT NULL,
    "judgingId" INTEGER NOT NULL,
    "testcaseId" INTEGER NOT NULL,
    "runOutputFileName" TEXT NOT NULL,
    "errorOutputFileName" TEXT NOT NULL,
    "checkerOutputFileName" TEXT NOT NULL,

    CONSTRAINT "JudgingRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judging" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "result" "JudgingResult",
    "systemError" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifyComment" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "compileOutputFileName" TEXT NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "juryMemberId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "judgeHostId" INTEGER NOT NULL,

    CONSTRAINT "Judging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JudgeHost" (
    "id" SERIAL NOT NULL,
    "hostname" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "pollTime" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "JudgeHost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "submitTime" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "sourceFileName" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "judgeHostId" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dockerImage" TEXT NOT NULL,
    "extensions" TEXT[],
    "allowSubmit" BOOLEAN NOT NULL DEFAULT true,
    "allowJudge" BOOLEAN NOT NULL DEFAULT true,
    "buildScriptName" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clarification" (
    "id" SERIAL NOT NULL,
    "general" BOOLEAN NOT NULL DEFAULT true,
    "contestId" INTEGER NOT NULL,
    "problemId" INTEGER,
    "teamId" INTEGER,

    CONSTRAINT "Clarification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClarificationMessage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "sentTime" TIMESTAMP(3) NOT NULL,
    "sentById" INTEGER NOT NULL,
    "clarificationId" INTEGER NOT NULL,

    CONSTRAINT "ClarificationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClarificationSeen" (
    "userId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "ClarificationSeen_pkey" PRIMARY KEY ("userId","messageId")
);

-- CreateTable
CREATE TABLE "ScoreCache" (
    "contestId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "pending" INTEGER NOT NULL DEFAULT 0,
    "solveTime" TIMESTAMP(3),
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "firstToSolve" BOOLEAN NOT NULL DEFAULT false,
    "restrictedSubmissions" INTEGER NOT NULL DEFAULT 0,
    "restrictedPending" INTEGER NOT NULL DEFAULT 0,
    "restrictedSolveTime" TIMESTAMP(3),
    "restrictedCorrect" BOOLEAN NOT NULL DEFAULT false,
    "restrictedFirstToSolve" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamContest_teamId_contestId_key" ON "TeamContest"("teamId", "contestId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamCategory_name_key" ON "TeamCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamCategory_rank_key" ON "TeamCategory"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_shortName_key" ON "Contest"("shortName");

-- CreateIndex
CREATE INDEX "Contest_id_enabled_idx" ON "Contest"("id", "enabled");

-- CreateIndex
CREATE INDEX "ContestProblem_contestId_problemId_idx" ON "ContestProblem"("contestId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestProblem_contestId_shortName_key" ON "ContestProblem"("contestId", "shortName");

-- CreateIndex
CREATE UNIQUE INDEX "Executable_sourceFileName_key" ON "Executable"("sourceFileName");

-- CreateIndex
CREATE UNIQUE INDEX "Executable_buildScriptName_key" ON "Executable"("buildScriptName");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_inputFileName_key" ON "Testcase"("inputFileName");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_outputFileName_key" ON "Testcase"("outputFileName");

-- CreateIndex
CREATE INDEX "Testcase_problemId_idx" ON "Testcase"("problemId");

-- CreateIndex
CREATE INDEX "Testcase_sample_idx" ON "Testcase"("sample");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_problemId_rank_key" ON "Testcase"("problemId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "JudgingRun_runOutputFileName_key" ON "JudgingRun"("runOutputFileName");

-- CreateIndex
CREATE UNIQUE INDEX "JudgingRun_errorOutputFileName_key" ON "JudgingRun"("errorOutputFileName");

-- CreateIndex
CREATE UNIQUE INDEX "JudgingRun_checkerOutputFileName_key" ON "JudgingRun"("checkerOutputFileName");

-- CreateIndex
CREATE UNIQUE INDEX "JudgingRun_judgingId_testcaseId_key" ON "JudgingRun"("judgingId", "testcaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Judging_compileOutputFileName_key" ON "Judging"("compileOutputFileName");

-- CreateIndex
CREATE UNIQUE INDEX "JudgeHost_hostname_key" ON "JudgeHost"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "JudgeHost_userId_key" ON "JudgeHost"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_sourceFileName_key" ON "Submission"("sourceFileName");

-- CreateIndex
CREATE INDEX "Submission_contestId_teamId_idx" ON "Submission"("contestId", "teamId");

-- CreateIndex
CREATE INDEX "Submission_contestId_problemId_idx" ON "Submission"("contestId", "problemId");

-- CreateIndex
CREATE INDEX "Submission_teamId_idx" ON "Submission"("teamId");

-- CreateIndex
CREATE INDEX "Submission_problemId_idx" ON "Submission"("problemId");

-- CreateIndex
CREATE INDEX "Submission_languageId_idx" ON "Submission"("languageId");

-- CreateIndex
CREATE INDEX "Submission_judgeHostId_idx" ON "Submission"("judgeHostId");

-- CreateIndex
CREATE INDEX "Submission_submitTime_idx" ON "Submission"("submitTime");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_buildScriptName_key" ON "Language"("buildScriptName");

-- CreateIndex
CREATE INDEX "ScoreCache_teamId_idx" ON "ScoreCache"("teamId");

-- CreateIndex
CREATE INDEX "ScoreCache_problemId_idx" ON "ScoreCache"("problemId");

-- CreateIndex
CREATE INDEX "ScoreCache_contestId_idx" ON "ScoreCache"("contestId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreCache_contestId_teamId_problemId_key" ON "ScoreCache"("contestId", "teamId", "problemId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TeamCategory"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TeamContest" ADD CONSTRAINT "TeamContest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TeamContest" ADD CONSTRAINT "TeamContest_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_statementFileName_fkey" FOREIGN KEY ("statementFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_runScriptId_fkey" FOREIGN KEY ("runScriptId") REFERENCES "Executable"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_checkScriptId_fkey" FOREIGN KEY ("checkScriptId") REFERENCES "Executable"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parentDirectoryName_fkey" FOREIGN KEY ("parentDirectoryName") REFERENCES "File"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Executable" ADD CONSTRAINT "Executable_sourceFileName_fkey" FOREIGN KEY ("sourceFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Executable" ADD CONSTRAINT "Executable_buildScriptName_fkey" FOREIGN KEY ("buildScriptName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_inputFileName_fkey" FOREIGN KEY ("inputFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_outputFileName_fkey" FOREIGN KEY ("outputFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JudgingRun" ADD CONSTRAINT "JudgingRun_judgingId_fkey" FOREIGN KEY ("judgingId") REFERENCES "Judging"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "JudgingRun" ADD CONSTRAINT "JudgingRun_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "JudgingRun" ADD CONSTRAINT "JudgingRun_runOutputFileName_fkey" FOREIGN KEY ("runOutputFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JudgingRun" ADD CONSTRAINT "JudgingRun_errorOutputFileName_fkey" FOREIGN KEY ("errorOutputFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JudgingRun" ADD CONSTRAINT "JudgingRun_checkerOutputFileName_fkey" FOREIGN KEY ("checkerOutputFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Judging" ADD CONSTRAINT "Judging_compileOutputFileName_fkey" FOREIGN KEY ("compileOutputFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Judging" ADD CONSTRAINT "Judging_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Judging" ADD CONSTRAINT "Judging_juryMemberId_fkey" FOREIGN KEY ("juryMemberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Judging" ADD CONSTRAINT "Judging_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Judging" ADD CONSTRAINT "Judging_judgeHostId_fkey" FOREIGN KEY ("judgeHostId") REFERENCES "JudgeHost"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "JudgeHost" ADD CONSTRAINT "JudgeHost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_sourceFileName_fkey" FOREIGN KEY ("sourceFileName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_judgeHostId_fkey" FOREIGN KEY ("judgeHostId") REFERENCES "JudgeHost"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_buildScriptName_fkey" FOREIGN KEY ("buildScriptName") REFERENCES "File"("name") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Clarification" ADD CONSTRAINT "Clarification_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Clarification" ADD CONSTRAINT "Clarification_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Clarification" ADD CONSTRAINT "Clarification_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ClarificationMessage" ADD CONSTRAINT "ClarificationMessage_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ClarificationMessage" ADD CONSTRAINT "ClarificationMessage_clarificationId_fkey" FOREIGN KEY ("clarificationId") REFERENCES "Clarification"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ClarificationSeen" ADD CONSTRAINT "ClarificationSeen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ClarificationSeen" ADD CONSTRAINT "ClarificationSeen_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ClarificationMessage"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoreCache" ADD CONSTRAINT "ScoreCache_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoreCache" ADD CONSTRAINT "ScoreCache_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ScoreCache" ADD CONSTRAINT "ScoreCache_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
