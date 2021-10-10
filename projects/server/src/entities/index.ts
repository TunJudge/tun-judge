import { ClarificationMessage } from './clarification-message.entity';
import { Clarification } from './clarification.entity';
import { ContestProblem } from './contest-problem.entity';
import { Contest } from './contest.entity';
import { Executable } from './executable.entity';
import { FileContent } from './file-content.entity';
import { File } from './file.entity';
import { JudgeHost } from './judge-host.entity';
import { JudgingRun } from './judging-run.entity';
import { Judging } from './judging.entity';
import { Language } from './language.entity';
import { Problem } from './problem.entity';
import { Role } from './role.entity';
import { ScoreCache } from './score-cache.entity';
import { Submission } from './submission.entity';
import { TeamCategory } from './team-category.entity';
import { Team } from './team.entity';
import { Testcase } from './testcase.entity';
import { User } from './user.entity';

export const entities = [
  User,
  Role,
  Team,
  File,
  Judging,
  Contest,
  Problem,
  Language,
  Testcase,
  JudgeHost,
  Executable,
  JudgingRun,
  ScoreCache,
  Submission,
  FileContent,
  TeamCategory,
  Clarification,
  ContestProblem,
  ClarificationMessage,
];

export * from './clarification-message.entity';
export * from './clarification.entity';
export * from './contest-problem.entity';
export * from './contest.entity';
export * from './executable.entity';
export * from './file-content.entity';
export * from './file.entity';
export * from './judge-host.entity';
export * from './judging-run.entity';
export * from './judging.entity';
export * from './language.entity';
export * from './problem.entity';
export * from './role.entity';
export * from './score-cache.entity';
export * from './submission.entity';
export * from './team-category.entity';
export * from './team.entity';
export * from './testcase.entity';
export * from './user.entity';
