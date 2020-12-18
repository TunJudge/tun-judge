import { User } from './user.entity';
import { Team } from './team.entity';
import { Role } from './role.entity';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { Language } from './language.entity';
import { Testcase } from './testcase.entity';
import { UserRole } from './user-role.entity';
import { JudgeHost } from './judge-host.entity';
import { Executable } from './executable.entity';
import { Submission } from './submission.entity';
import { ScoreCache } from './score-cache-entity';
import { SubmissionFile } from './submission-file.entity';
import { ContestProblem } from './contest-problem.entity';
import { TestcaseContent } from './testcase-content.entity';

export const entities = [
  User,
  Role,
  Team,
  Contest,
  Problem,
  UserRole,
  Language,
  Testcase,
  JudgeHost,
  Executable,
  ScoreCache,
  Submission,
  ContestProblem,
  SubmissionFile,
  TestcaseContent,
];

export * from './user.entity';
export * from './role.entity';
export * from './team.entity';
export * from './contest.entity';
export * from './problem.entity';
export * from './testcase.entity';
export * from './language.entity';
export * from './user-role.entity';
export * from './executable.entity';
export * from './submission.entity';
export * from './judge-host.entity';
export * from './score-cache-entity';
export * from './submission-file.entity';
export * from './contest-problem.entity';
export * from './testcase-content.entity';
