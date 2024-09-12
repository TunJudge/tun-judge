import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1634854363202 implements MigrationInterface {
  name = 'CreateDatabase1634854363202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file_content" ("id" SERIAL NOT NULL, "payload" text NOT NULL, CONSTRAINT "PK_1b2ed36a4dfc8cc54a8a0e5fb4b" PRIMARY KEY ("id")); COMMENT ON COLUMN "file_content"."id" IS 'File ID'; COMMENT ON COLUMN "file_content"."payload" IS 'File Content'`
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "size" integer NOT NULL, "md5Sum" character varying NOT NULL, "contentId" integer NOT NULL, CONSTRAINT "REL_abc4c6c6a915267ff3b4f8aaf9" UNIQUE ("contentId"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")); COMMENT ON COLUMN "file"."id" IS 'File ID'; COMMENT ON COLUMN "file"."name" IS 'File name'; COMMENT ON COLUMN "file"."type" IS 'File type'; COMMENT ON COLUMN "file"."size" IS 'File size'; COMMENT ON COLUMN "file"."md5Sum" IS 'File MD5 checksum'; COMMENT ON COLUMN "file"."contentId" IS 'File ID'`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."executable_type_enum" AS ENUM('RUNNER', 'CHECKER')`
    );
    await queryRunner.query(
      `CREATE TABLE "executable" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "default" boolean NOT NULL DEFAULT false, "dockerImage" character varying, "type" "public"."executable_type_enum" NOT NULL, "sourceFileId" integer NOT NULL, "buildScriptId" integer, CONSTRAINT "REL_67cb9a30f868c08cf1b9c3153f" UNIQUE ("sourceFileId"), CONSTRAINT "REL_4dab54932c0b64bbb0c52bd804" UNIQUE ("buildScriptId"), CONSTRAINT "PK_fb14377b6ae1f3cd6d0152506f5" PRIMARY KEY ("id")); COMMENT ON COLUMN "executable"."id" IS 'Executable ID'; COMMENT ON COLUMN "executable"."name" IS 'Executable Name'; COMMENT ON COLUMN "executable"."description" IS 'Description of this executable'; COMMENT ON COLUMN "executable"."default" IS 'Description of this executable'; COMMENT ON COLUMN "executable"."dockerImage" IS 'Language Docker Image'; COMMENT ON COLUMN "executable"."type" IS 'Type of this executable'; COMMENT ON COLUMN "executable"."sourceFileId" IS 'File ID'; COMMENT ON COLUMN "executable"."buildScriptId" IS 'File ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "testcase" ("id" SERIAL NOT NULL, "description" character varying, "rank" integer NOT NULL, "sample" boolean NOT NULL DEFAULT false, "deleted" boolean NOT NULL DEFAULT false, "inputId" integer NOT NULL, "outputId" integer NOT NULL, "problemId" integer NOT NULL, CONSTRAINT "UQ_80ad7b02d5f08f2662b6488d130" UNIQUE ("problemId", "rank"), CONSTRAINT "REL_af3c56db34c946b74cbd16850b" UNIQUE ("inputId"), CONSTRAINT "REL_433fe643b38343cd88ed1127e8" UNIQUE ("outputId"), CONSTRAINT "PK_4ad556a52f20b5b45725ebf3830" PRIMARY KEY ("id")); COMMENT ON COLUMN "testcase"."id" IS 'Test case ID'; COMMENT ON COLUMN "testcase"."description" IS 'Test case description'; COMMENT ON COLUMN "testcase"."rank" IS 'Test case rank for judging'; COMMENT ON COLUMN "testcase"."sample" IS 'Whether the test case can be shared with the teams'; COMMENT ON COLUMN "testcase"."deleted" IS 'Deleted testcase are kept for referential integrity'; COMMENT ON COLUMN "testcase"."inputId" IS 'File ID'; COMMENT ON COLUMN "testcase"."outputId" IS 'File ID'; COMMENT ON COLUMN "testcase"."problemId" IS 'Problem ID'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23d9018a530ed140f9ff637b6e" ON "testcase" ("sample") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f666e327261509c65eafb2105a" ON "testcase" ("problemId") `
    );
    await queryRunner.query(
      `CREATE TABLE "problem" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timeLimit" double precision NOT NULL DEFAULT '0', "memoryLimit" integer NOT NULL DEFAULT '2097152', "outputLimit" integer NOT NULL DEFAULT '8192', "fileId" integer NOT NULL, "runScriptId" integer NOT NULL, "checkScriptId" integer NOT NULL, CONSTRAINT "REL_d7d44e21c421a48fa4b05c3d22" UNIQUE ("fileId"), CONSTRAINT "PK_119b5ca6f3371465bf1f0f90219" PRIMARY KEY ("id")); COMMENT ON COLUMN "problem"."id" IS 'Problem ID'; COMMENT ON COLUMN "problem"."name" IS 'Problem name'; COMMENT ON COLUMN "problem"."timeLimit" IS 'Problem maximum run time (in seconds)'; COMMENT ON COLUMN "problem"."memoryLimit" IS 'Problem maximum memory (in kB)'; COMMENT ON COLUMN "problem"."outputLimit" IS 'Problem maximum output size (in kB)'; COMMENT ON COLUMN "problem"."fileId" IS 'File ID'; COMMENT ON COLUMN "problem"."runScriptId" IS 'Executable ID'; COMMENT ON COLUMN "problem"."checkScriptId" IS 'Executable ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "contest_problem" ("shortName" character varying NOT NULL, "points" integer NOT NULL DEFAULT '1', "allowSubmit" boolean NOT NULL DEFAULT true, "allowJudge" boolean NOT NULL DEFAULT true, "color" character varying, "contestId" integer NOT NULL, "problemId" integer NOT NULL, CONSTRAINT "UQ_0899247511104d361f575b6025e" UNIQUE ("contestId", "shortName"), CONSTRAINT "PK_71dbe9a8fd195e1503e9b286ad7" PRIMARY KEY ("contestId", "problemId")); COMMENT ON COLUMN "contest_problem"."points" IS 'Number of points earned by solving this problem'; COMMENT ON COLUMN "contest_problem"."allowSubmit" IS 'Whether to accept submissions for this problem'; COMMENT ON COLUMN "contest_problem"."allowJudge" IS 'Whether to judge the submissions of this problem'; COMMENT ON COLUMN "contest_problem"."color" IS 'Problem balloon color'; COMMENT ON COLUMN "contest_problem"."contestId" IS 'Contest ID'; COMMENT ON COLUMN "contest_problem"."problemId" IS 'Problem ID'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_71dbe9a8fd195e1503e9b286ad" ON "contest_problem" ("contestId", "problemId") `
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_ae4578dcaed5adff96595e61660" PRIMARY KEY ("name")); COMMENT ON COLUMN "role"."name" IS 'Role name'; COMMENT ON COLUMN "role"."description" IS 'Role description'`
    );
    await queryRunner.query(
      `CREATE TABLE "team_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "sortOrder" integer NOT NULL, "color" character varying NOT NULL DEFAULT '#ffffff', "visible" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_ba34a2a7ccedf76cc4b46416e69" UNIQUE ("sortOrder"), CONSTRAINT "PK_38020535e6a32d763231e70004f" PRIMARY KEY ("id")); COMMENT ON COLUMN "team_category"."id" IS 'Team Category ID'; COMMENT ON COLUMN "team_category"."name" IS 'Team Category name'; COMMENT ON COLUMN "team_category"."sortOrder" IS 'Team Category scoreboard sort index'; COMMENT ON COLUMN "team_category"."color" IS 'Background color in the scoreboard'; COMMENT ON COLUMN "team_category"."visible" IS 'Whether the teams in this category are visible in the scoreboard'`
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "room" character varying, "comments" character varying, "penalty" integer NOT NULL DEFAULT '0', "categoryId" integer, CONSTRAINT "UQ_cf461f5b40cf1a2b8876011e1e1" UNIQUE ("name"), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id")); COMMENT ON COLUMN "team"."id" IS 'Team ID'; COMMENT ON COLUMN "team"."name" IS 'Team name'; COMMENT ON COLUMN "team"."enabled" IS 'Whether the team is visible and operational'; COMMENT ON COLUMN "team"."room" IS 'Team physical location'; COMMENT ON COLUMN "team"."comments" IS 'Comments about this team'; COMMENT ON COLUMN "team"."penalty" IS 'Additional penalty time in minutes'; COMMENT ON COLUMN "team"."categoryId" IS 'Team Category ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "lastLogin" TIMESTAMP, "lastIpAddress" character varying, "enabled" boolean NOT NULL DEFAULT true, "sessionId" character varying, "teamId" integer, "roleName" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."id" IS 'User ID'; COMMENT ON COLUMN "user"."name" IS 'User full name'; COMMENT ON COLUMN "user"."username" IS 'User login'; COMMENT ON COLUMN "user"."password" IS 'User password hash'; COMMENT ON COLUMN "user"."email" IS 'User email address'; COMMENT ON COLUMN "user"."lastLogin" IS 'User last successful login'; COMMENT ON COLUMN "user"."lastIpAddress" IS 'User last IP address of successful login'; COMMENT ON COLUMN "user"."enabled" IS 'Whether the user is able to log in'; COMMENT ON COLUMN "user"."sessionId" IS 'User Express session ID'; COMMENT ON COLUMN "user"."teamId" IS 'Team ID'; COMMENT ON COLUMN "user"."roleName" IS 'Role name'`
    );
    await queryRunner.query(
      `CREATE TABLE "judge_host" ("id" SERIAL NOT NULL, "hostname" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "pollTime" TIMESTAMP, "userId" integer, CONSTRAINT "UQ_69cf723e0684b53afcada2606c8" UNIQUE ("hostname"), CONSTRAINT "REL_5361e03d0181e8e64fe58c8036" UNIQUE ("userId"), CONSTRAINT "PK_68f2635e56f678c50abb28dff33" PRIMARY KEY ("id")); COMMENT ON COLUMN "judge_host"."id" IS 'Judge host ID'; COMMENT ON COLUMN "judge_host"."hostname" IS 'Judge host hostname'; COMMENT ON COLUMN "judge_host"."active" IS 'Whether the judge host is enabled'; COMMENT ON COLUMN "judge_host"."pollTime" IS 'Time of last poll'; COMMENT ON COLUMN "judge_host"."userId" IS 'User ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "judging_run" ("id" SERIAL NOT NULL, "result" character varying, "endTime" TIMESTAMP NOT NULL, "runTime" double precision NOT NULL, "runMemory" double precision NOT NULL, "judgingId" integer, "testcaseId" integer, "runOutputId" integer, "errorOutputId" integer, "checkerOutputId" integer, CONSTRAINT "UQ_16ee1aa6296bae17233f256d921" UNIQUE ("judgingId", "testcaseId"), CONSTRAINT "REL_c113e304e204832806291ab5f8" UNIQUE ("runOutputId"), CONSTRAINT "REL_4d011f9451220729b7a6757e1c" UNIQUE ("errorOutputId"), CONSTRAINT "REL_9be9bdc45214319304bb26a1b1" UNIQUE ("checkerOutputId"), CONSTRAINT "PK_7299ac083687af36a0e7e4a0368" PRIMARY KEY ("id")); COMMENT ON COLUMN "judging_run"."id" IS 'Judging Run ID'; COMMENT ON COLUMN "judging_run"."result" IS 'Judging Run result'; COMMENT ON COLUMN "judging_run"."endTime" IS 'Judging Run end time'; COMMENT ON COLUMN "judging_run"."runTime" IS 'Submission running time on this testcase'; COMMENT ON COLUMN "judging_run"."runMemory" IS 'Submission used memory on this testcase'; COMMENT ON COLUMN "judging_run"."judgingId" IS 'Judging ID'; COMMENT ON COLUMN "judging_run"."testcaseId" IS 'Test case ID'; COMMENT ON COLUMN "judging_run"."runOutputId" IS 'File ID'; COMMENT ON COLUMN "judging_run"."errorOutputId" IS 'File ID'; COMMENT ON COLUMN "judging_run"."checkerOutputId" IS 'File ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "judging" ("id" SERIAL NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP, "result" character varying, "systemError" character varying, "verified" boolean NOT NULL DEFAULT false, "verifyComment" character varying, "valid" boolean NOT NULL DEFAULT true, "compileOutputId" integer, "juryMemberId" integer, "contestId" integer NOT NULL, "judgeHostId" integer NOT NULL, "submissionId" integer NOT NULL, CONSTRAINT "REL_b3ee819715d6d8cb3daebb945d" UNIQUE ("compileOutputId"), CONSTRAINT "PK_91c6306a50cd4080994cdb7087c" PRIMARY KEY ("id")); COMMENT ON COLUMN "judging"."id" IS 'Judging ID'; COMMENT ON COLUMN "judging"."startTime" IS 'Judging start time'; COMMENT ON COLUMN "judging"."endTime" IS 'Judging end time'; COMMENT ON COLUMN "judging"."result" IS 'Judging result'; COMMENT ON COLUMN "judging"."systemError" IS 'System error message'; COMMENT ON COLUMN "judging"."verified" IS 'Whether the judging was verified by a jury member'; COMMENT ON COLUMN "judging"."verifyComment" IS 'Judging verify comment'; COMMENT ON COLUMN "judging"."valid" IS 'Old Judging is marked as invalid when rejudging'; COMMENT ON COLUMN "judging"."compileOutputId" IS 'File ID'; COMMENT ON COLUMN "judging"."juryMemberId" IS 'User ID'; COMMENT ON COLUMN "judging"."contestId" IS 'Contest ID'; COMMENT ON COLUMN "judging"."judgeHostId" IS 'Judge host ID'; COMMENT ON COLUMN "judging"."submissionId" IS 'Submission ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "language" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "dockerImage" character varying NOT NULL, "extensions" json NOT NULL DEFAULT '[]', "allowSubmit" boolean NOT NULL DEFAULT true, "allowJudge" boolean NOT NULL DEFAULT true, "buildScriptId" integer NOT NULL, CONSTRAINT "UQ_7df7d1e250ea2a416f078a631fb" UNIQUE ("name"), CONSTRAINT "REL_2c52027b6c0f3269e67c8c1271" UNIQUE ("buildScriptId"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id")); COMMENT ON COLUMN "language"."id" IS 'Language ID'; COMMENT ON COLUMN "language"."name" IS 'Language name'; COMMENT ON COLUMN "language"."dockerImage" IS 'Language Docker Image'; COMMENT ON COLUMN "language"."extensions" IS 'Language''s file possible extensions'; COMMENT ON COLUMN "language"."allowSubmit" IS 'Whether to accept submissions with this language'; COMMENT ON COLUMN "language"."allowJudge" IS 'Whether to judge submissions with this language'; COMMENT ON COLUMN "language"."buildScriptId" IS 'File ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "submission" ("id" SERIAL NOT NULL, "submitTime" TIMESTAMP NOT NULL, "valid" boolean NOT NULL DEFAULT true, "contestId" integer NOT NULL, "teamId" integer NOT NULL, "problemId" integer NOT NULL, "languageId" integer NOT NULL, "judgeHostId" integer, "fileId" integer NOT NULL, CONSTRAINT "REL_dec51148a6379ffdc1ea98fdb8" UNIQUE ("fileId"), CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id")); COMMENT ON COLUMN "submission"."id" IS 'Submission ID'; COMMENT ON COLUMN "submission"."submitTime" IS 'Submission time'; COMMENT ON COLUMN "submission"."valid" IS 'If false, the submission should be ignored in all scoreboard calculation'; COMMENT ON COLUMN "submission"."contestId" IS 'Contest ID'; COMMENT ON COLUMN "submission"."teamId" IS 'Team ID'; COMMENT ON COLUMN "submission"."problemId" IS 'Problem ID'; COMMENT ON COLUMN "submission"."languageId" IS 'Language ID'; COMMENT ON COLUMN "submission"."judgeHostId" IS 'Judge host ID'; COMMENT ON COLUMN "submission"."fileId" IS 'File ID'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ebd1b63340ac17250257bb42d3" ON "submission" ("submitTime") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_008a32506556c5e1de03180b7b" ON "submission" ("judgeHostId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8be0602ec1b628ddf977804e91" ON "submission" ("languageId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3182d5e825aa9dee60559030d4" ON "submission" ("problemId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ad334aa998a6a653c31cab4a3" ON "submission" ("teamId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e74d4dd0eccbb948f767767203" ON "submission" ("contestId", "problemId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3138b367bd5ee1d7f7376d6665" ON "submission" ("contestId", "teamId") `
    );
    await queryRunner.query(
      `CREATE TABLE "contest" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "shortName" character varying NOT NULL, "activateTime" TIMESTAMP NOT NULL, "startTime" TIMESTAMP NOT NULL, "freezeTime" TIMESTAMP, "endTime" TIMESTAMP NOT NULL, "unfreezeTime" TIMESTAMP, "enabled" boolean NOT NULL DEFAULT true, "processBalloons" boolean NOT NULL DEFAULT false, "public" boolean NOT NULL DEFAULT true, "openToAllTeams" boolean NOT NULL DEFAULT false, "verificationRequired" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e42cf30259b5c81d80a35aa7c70" UNIQUE ("shortName"), CONSTRAINT "PK_ba048331bed7d939b857e9c1c63" PRIMARY KEY ("id")); COMMENT ON COLUMN "contest"."id" IS 'Contest ID'; COMMENT ON COLUMN "contest"."name" IS 'Contest name'; COMMENT ON COLUMN "contest"."shortName" IS 'Contest short name'; COMMENT ON COLUMN "contest"."activateTime" IS 'Time contest become visible'; COMMENT ON COLUMN "contest"."startTime" IS 'Time contest starts'; COMMENT ON COLUMN "contest"."freezeTime" IS 'Time scoreboard is frozen'; COMMENT ON COLUMN "contest"."endTime" IS 'Time contest end and no submissions are accepted'; COMMENT ON COLUMN "contest"."unfreezeTime" IS 'Time scoreboard is unfrozen'; COMMENT ON COLUMN "contest"."enabled" IS 'Whether the contest can be active'; COMMENT ON COLUMN "contest"."processBalloons" IS 'Whether the balloons will be processed'; COMMENT ON COLUMN "contest"."public" IS 'Whether the contest is visible for the public'; COMMENT ON COLUMN "contest"."openToAllTeams" IS 'Whether the contest is open to any logged in team'; COMMENT ON COLUMN "contest"."verificationRequired" IS 'Whether the submissions needs verification before showing the result to the team'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fdc1a9b62975f0e80f21c81a30" ON "contest" ("id", "enabled") `
    );
    await queryRunner.query(
      `CREATE TABLE "clarification" ("id" SERIAL NOT NULL, "general" boolean NOT NULL DEFAULT true, "contestId" integer NOT NULL, "problemId" integer, "teamId" integer, CONSTRAINT "PK_dc58e35c9d3bb8bdf64040462a2" PRIMARY KEY ("id")); COMMENT ON COLUMN "clarification"."id" IS 'Clarification ID'; COMMENT ON COLUMN "clarification"."general" IS 'Whether the Clarification is general'; COMMENT ON COLUMN "clarification"."contestId" IS 'Contest ID'; COMMENT ON COLUMN "clarification"."problemId" IS 'Problem ID'; COMMENT ON COLUMN "clarification"."teamId" IS 'Team ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "clarification_message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "sentTime" TIMESTAMP NOT NULL, "sentById" integer NOT NULL, "clarificationId" integer NOT NULL, CONSTRAINT "PK_c18f85063ab70c6aef4d1c35112" PRIMARY KEY ("id")); COMMENT ON COLUMN "clarification_message"."id" IS 'Clarification Message ID'; COMMENT ON COLUMN "clarification_message"."content" IS 'The message content'; COMMENT ON COLUMN "clarification_message"."sentTime" IS 'The message sent time'; COMMENT ON COLUMN "clarification_message"."sentById" IS 'User ID'; COMMENT ON COLUMN "clarification_message"."clarificationId" IS 'Clarification ID'`
    );
    await queryRunner.query(
      `CREATE TABLE "initial_data_entity" ("id" SERIAL NOT NULL, "date" TIMESTAMP, CONSTRAINT "PK_a702e7d417e3950e021244ae6db" PRIMARY KEY ("id")); COMMENT ON COLUMN "initial_data_entity"."id" IS 'Initial Data ID'; COMMENT ON COLUMN "initial_data_entity"."date" IS 'When the initial data got stored in database'`
    );
    await queryRunner.query(
      `CREATE TABLE "score_cache" ("submissions" integer NOT NULL DEFAULT '0', "pending" integer NOT NULL DEFAULT '0', "solveTime" TIMESTAMP, "correct" boolean NOT NULL DEFAULT false, "firstToSolve" boolean NOT NULL DEFAULT false, "restrictedPending" integer NOT NULL DEFAULT '0', "restrictedSolveTime" TIMESTAMP, "restrictedCorrect" boolean NOT NULL DEFAULT false, "restrictedSubmissions" integer NOT NULL DEFAULT '0', "restrictedFirstToSolve" boolean NOT NULL DEFAULT false, "contestId" integer NOT NULL, "teamId" integer NOT NULL, "problemId" integer NOT NULL, CONSTRAINT "PK_def4640d484e4b9ff4ee7ce466a" PRIMARY KEY ("contestId", "teamId", "problemId")); COMMENT ON COLUMN "score_cache"."submissions" IS 'Number of submissions made (public)'; COMMENT ON COLUMN "score_cache"."pending" IS 'Number of pending submissions (public)'; COMMENT ON COLUMN "score_cache"."solveTime" IS 'Time when the problem was solved (public)'; COMMENT ON COLUMN "score_cache"."correct" IS 'Whether there is a correct submission (public)'; COMMENT ON COLUMN "score_cache"."firstToSolve" IS 'Whether there is the first solution for this problem'; COMMENT ON COLUMN "score_cache"."restrictedPending" IS 'Number of pending submissions (restricted)'; COMMENT ON COLUMN "score_cache"."restrictedSolveTime" IS 'Time when the problem was solved (restricted)'; COMMENT ON COLUMN "score_cache"."restrictedCorrect" IS 'Whether there is a correct submission (restricted)'; COMMENT ON COLUMN "score_cache"."restrictedSubmissions" IS 'Number of submissions made (restricted)'; COMMENT ON COLUMN "score_cache"."restrictedFirstToSolve" IS 'Whether there is the first solution for this problem (restricted)'; COMMENT ON COLUMN "score_cache"."contestId" IS 'Contest ID'; COMMENT ON COLUMN "score_cache"."teamId" IS 'Team ID'; COMMENT ON COLUMN "score_cache"."problemId" IS 'Problem ID'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8fc7b1a9cb06d1d22aec85ff35" ON "score_cache" ("contestId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_36b5ccf8d76c40833c63e9e023" ON "score_cache" ("problemId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9fc0eb5e4511799d7d20d6eca6" ON "score_cache" ("teamId") `
    );
    await queryRunner.query(
      `CREATE TABLE "team_contests_contest" ("teamId" integer NOT NULL, "contestId" integer NOT NULL, CONSTRAINT "PK_0e5738331321878bcb020d976cd" PRIMARY KEY ("teamId", "contestId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_597e1ea663b3ce61a27fded3d4" ON "team_contests_contest" ("teamId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91eb01761111a6ed181ded8daf" ON "team_contests_contest" ("contestId") `
    );
    await queryRunner.query(
      `CREATE TABLE "clarification_message_seen_by_user" ("clarificationMessageId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c049d7596144fd4b3daf53615f0" PRIMARY KEY ("clarificationMessageId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e7df8c1ef548b84b1e61652ce" ON "clarification_message_seen_by_user" ("clarificationMessageId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d702dccbeff1d167019ca508b8" ON "clarification_message_seen_by_user" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_abc4c6c6a915267ff3b4f8aaf9d" FOREIGN KEY ("contentId") REFERENCES "file_content"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "executable" ADD CONSTRAINT "FK_67cb9a30f868c08cf1b9c3153f6" FOREIGN KEY ("sourceFileId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "executable" ADD CONSTRAINT "FK_4dab54932c0b64bbb0c52bd8043" FOREIGN KEY ("buildScriptId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "testcase" ADD CONSTRAINT "FK_af3c56db34c946b74cbd16850b1" FOREIGN KEY ("inputId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "testcase" ADD CONSTRAINT "FK_433fe643b38343cd88ed1127e89" FOREIGN KEY ("outputId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "testcase" ADD CONSTRAINT "FK_f666e327261509c65eafb2105a9" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "problem" ADD CONSTRAINT "FK_d7d44e21c421a48fa4b05c3d22d" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "problem" ADD CONSTRAINT "FK_217078a8db8b6fa4e66c086eba3" FOREIGN KEY ("runScriptId") REFERENCES "executable"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "problem" ADD CONSTRAINT "FK_9b16683ed5ae9fdaf1dd8e52062" FOREIGN KEY ("checkScriptId") REFERENCES "executable"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "contest_problem" ADD CONSTRAINT "FK_62eec1907733dae6d4ef096afdb" FOREIGN KEY ("contestId") REFERENCES "contest"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "contest_problem" ADD CONSTRAINT "FK_4ee151e7518247b13d7069ae6f9" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a37aa2ab554dfbf5b4290b8af90" FOREIGN KEY ("categoryId") REFERENCES "team_category"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_ccf9b0ec984324d7ad5f861a493" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "judge_host" ADD CONSTRAINT "FK_5361e03d0181e8e64fe58c80366" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" ADD CONSTRAINT "FK_bf0368443525a11c70c5c0a0166" FOREIGN KEY ("judgingId") REFERENCES "judging"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" ADD CONSTRAINT "FK_0ea13381d097f2ebbf41fd3b77a" FOREIGN KEY ("testcaseId") REFERENCES "testcase"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" ADD CONSTRAINT "FK_c113e304e204832806291ab5f87" FOREIGN KEY ("runOutputId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" ADD CONSTRAINT "FK_4d011f9451220729b7a6757e1c6" FOREIGN KEY ("errorOutputId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" ADD CONSTRAINT "FK_9be9bdc45214319304bb26a1b16" FOREIGN KEY ("checkerOutputId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" ADD CONSTRAINT "FK_b3ee819715d6d8cb3daebb945d9" FOREIGN KEY ("compileOutputId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" ADD CONSTRAINT "FK_aa91448c95c545d04d00b47722c" FOREIGN KEY ("juryMemberId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" ADD CONSTRAINT "FK_0044a770e61e2bd82d484d56b6e" FOREIGN KEY ("contestId") REFERENCES "contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" ADD CONSTRAINT "FK_9c11d929c16f959c79637519d66" FOREIGN KEY ("judgeHostId") REFERENCES "judge_host"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" ADD CONSTRAINT "FK_f80ff07781c433aab21b2e1e8ae" FOREIGN KEY ("submissionId") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "language" ADD CONSTRAINT "FK_2c52027b6c0f3269e67c8c12719" FOREIGN KEY ("buildScriptId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_544c5a49372480c486c00545eae" FOREIGN KEY ("contestId") REFERENCES "contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_7ad334aa998a6a653c31cab4a32" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_3182d5e825aa9dee60559030d49" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_8be0602ec1b628ddf977804e917" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_008a32506556c5e1de03180b7bc" FOREIGN KEY ("judgeHostId") REFERENCES "judge_host"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" ADD CONSTRAINT "FK_dec51148a6379ffdc1ea98fdb82" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification" ADD CONSTRAINT "FK_ac51438cf703daac8de5039ba23" FOREIGN KEY ("contestId") REFERENCES "contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification" ADD CONSTRAINT "FK_d7da2ea44b43b114d5a35a99958" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification" ADD CONSTRAINT "FK_9e13dfc8ed8a433c6586b0801f7" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message" ADD CONSTRAINT "FK_2d93b20d9dd9364f40cdb2bc8c0" FOREIGN KEY ("sentById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message" ADD CONSTRAINT "FK_893aa6adb3e5e467d1e80e12f1a" FOREIGN KEY ("clarificationId") REFERENCES "clarification"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "score_cache" ADD CONSTRAINT "FK_8fc7b1a9cb06d1d22aec85ff353" FOREIGN KEY ("contestId") REFERENCES "contest"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "score_cache" ADD CONSTRAINT "FK_9fc0eb5e4511799d7d20d6eca6a" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "score_cache" ADD CONSTRAINT "FK_36b5ccf8d76c40833c63e9e0230" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE RESTRICT`
    );
    await queryRunner.query(
      `ALTER TABLE "team_contests_contest" ADD CONSTRAINT "FK_597e1ea663b3ce61a27fded3d4a" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "team_contests_contest" ADD CONSTRAINT "FK_91eb01761111a6ed181ded8dafd" FOREIGN KEY ("contestId") REFERENCES "contest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message_seen_by_user" ADD CONSTRAINT "FK_4e7df8c1ef548b84b1e61652ce5" FOREIGN KEY ("clarificationMessageId") REFERENCES "clarification_message"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message_seen_by_user" ADD CONSTRAINT "FK_d702dccbeff1d167019ca508b86" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clarification_message_seen_by_user" DROP CONSTRAINT "FK_d702dccbeff1d167019ca508b86"`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message_seen_by_user" DROP CONSTRAINT "FK_4e7df8c1ef548b84b1e61652ce5"`
    );
    await queryRunner.query(
      `ALTER TABLE "team_contests_contest" DROP CONSTRAINT "FK_91eb01761111a6ed181ded8dafd"`
    );
    await queryRunner.query(
      `ALTER TABLE "team_contests_contest" DROP CONSTRAINT "FK_597e1ea663b3ce61a27fded3d4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "score_cache" DROP CONSTRAINT "FK_36b5ccf8d76c40833c63e9e0230"`
    );
    await queryRunner.query(
      `ALTER TABLE "score_cache" DROP CONSTRAINT "FK_9fc0eb5e4511799d7d20d6eca6a"`
    );
    await queryRunner.query(
      `ALTER TABLE "score_cache" DROP CONSTRAINT "FK_8fc7b1a9cb06d1d22aec85ff353"`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message" DROP CONSTRAINT "FK_893aa6adb3e5e467d1e80e12f1a"`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification_message" DROP CONSTRAINT "FK_2d93b20d9dd9364f40cdb2bc8c0"`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification" DROP CONSTRAINT "FK_9e13dfc8ed8a433c6586b0801f7"`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification" DROP CONSTRAINT "FK_d7da2ea44b43b114d5a35a99958"`
    );
    await queryRunner.query(
      `ALTER TABLE "clarification" DROP CONSTRAINT "FK_ac51438cf703daac8de5039ba23"`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_dec51148a6379ffdc1ea98fdb82"`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_008a32506556c5e1de03180b7bc"`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_8be0602ec1b628ddf977804e917"`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_3182d5e825aa9dee60559030d49"`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_7ad334aa998a6a653c31cab4a32"`
    );
    await queryRunner.query(
      `ALTER TABLE "submission" DROP CONSTRAINT "FK_544c5a49372480c486c00545eae"`
    );
    await queryRunner.query(
      `ALTER TABLE "language" DROP CONSTRAINT "FK_2c52027b6c0f3269e67c8c12719"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" DROP CONSTRAINT "FK_f80ff07781c433aab21b2e1e8ae"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" DROP CONSTRAINT "FK_9c11d929c16f959c79637519d66"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" DROP CONSTRAINT "FK_0044a770e61e2bd82d484d56b6e"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" DROP CONSTRAINT "FK_aa91448c95c545d04d00b47722c"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging" DROP CONSTRAINT "FK_b3ee819715d6d8cb3daebb945d9"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" DROP CONSTRAINT "FK_9be9bdc45214319304bb26a1b16"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" DROP CONSTRAINT "FK_4d011f9451220729b7a6757e1c6"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" DROP CONSTRAINT "FK_c113e304e204832806291ab5f87"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" DROP CONSTRAINT "FK_0ea13381d097f2ebbf41fd3b77a"`
    );
    await queryRunner.query(
      `ALTER TABLE "judging_run" DROP CONSTRAINT "FK_bf0368443525a11c70c5c0a0166"`
    );
    await queryRunner.query(
      `ALTER TABLE "judge_host" DROP CONSTRAINT "FK_5361e03d0181e8e64fe58c80366"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ccf9b0ec984324d7ad5f861a493"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25"`);
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_a37aa2ab554dfbf5b4290b8af90"`);
    await queryRunner.query(
      `ALTER TABLE "contest_problem" DROP CONSTRAINT "FK_4ee151e7518247b13d7069ae6f9"`
    );
    await queryRunner.query(
      `ALTER TABLE "contest_problem" DROP CONSTRAINT "FK_62eec1907733dae6d4ef096afdb"`
    );
    await queryRunner.query(
      `ALTER TABLE "problem" DROP CONSTRAINT "FK_9b16683ed5ae9fdaf1dd8e52062"`
    );
    await queryRunner.query(
      `ALTER TABLE "problem" DROP CONSTRAINT "FK_217078a8db8b6fa4e66c086eba3"`
    );
    await queryRunner.query(
      `ALTER TABLE "problem" DROP CONSTRAINT "FK_d7d44e21c421a48fa4b05c3d22d"`
    );
    await queryRunner.query(
      `ALTER TABLE "testcase" DROP CONSTRAINT "FK_f666e327261509c65eafb2105a9"`
    );
    await queryRunner.query(
      `ALTER TABLE "testcase" DROP CONSTRAINT "FK_433fe643b38343cd88ed1127e89"`
    );
    await queryRunner.query(
      `ALTER TABLE "testcase" DROP CONSTRAINT "FK_af3c56db34c946b74cbd16850b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "executable" DROP CONSTRAINT "FK_4dab54932c0b64bbb0c52bd8043"`
    );
    await queryRunner.query(
      `ALTER TABLE "executable" DROP CONSTRAINT "FK_67cb9a30f868c08cf1b9c3153f6"`
    );
    await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_abc4c6c6a915267ff3b4f8aaf9d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d702dccbeff1d167019ca508b8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4e7df8c1ef548b84b1e61652ce"`);
    await queryRunner.query(`DROP TABLE "clarification_message_seen_by_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_91eb01761111a6ed181ded8daf"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_597e1ea663b3ce61a27fded3d4"`);
    await queryRunner.query(`DROP TABLE "team_contests_contest"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9fc0eb5e4511799d7d20d6eca6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_36b5ccf8d76c40833c63e9e023"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8fc7b1a9cb06d1d22aec85ff35"`);
    await queryRunner.query(`DROP TABLE "score_cache"`);
    await queryRunner.query(`DROP TABLE "initial_data_entity"`);
    await queryRunner.query(`DROP TABLE "clarification_message"`);
    await queryRunner.query(`DROP TABLE "clarification"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fdc1a9b62975f0e80f21c81a30"`);
    await queryRunner.query(`DROP TABLE "contest"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3138b367bd5ee1d7f7376d6665"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e74d4dd0eccbb948f767767203"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7ad334aa998a6a653c31cab4a3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3182d5e825aa9dee60559030d4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8be0602ec1b628ddf977804e91"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_008a32506556c5e1de03180b7b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ebd1b63340ac17250257bb42d3"`);
    await queryRunner.query(`DROP TABLE "submission"`);
    await queryRunner.query(`DROP TABLE "language"`);
    await queryRunner.query(`DROP TABLE "judging"`);
    await queryRunner.query(`DROP TABLE "judging_run"`);
    await queryRunner.query(`DROP TABLE "judge_host"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "team_category"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_71dbe9a8fd195e1503e9b286ad"`);
    await queryRunner.query(`DROP TABLE "contest_problem"`);
    await queryRunner.query(`DROP TABLE "problem"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f666e327261509c65eafb2105a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_23d9018a530ed140f9ff637b6e"`);
    await queryRunner.query(`DROP TABLE "testcase"`);
    await queryRunner.query(`DROP TABLE "executable"`);
    await queryRunner.query(`DROP TYPE "public"."executable_type_enum"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "file_content"`);
  }
}
