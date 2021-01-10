import { User } from './user.entity';
import { Team } from './team.entity';
import { Role } from './role.entity';
import { File } from './file.entity';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { Language } from './language.entity';
import { Testcase } from './testcase.entity';
import { JudgeHost } from './judge-host.entity';
import { Executable } from './executable.entity';
import { Submission } from './submission.entity';
import { ScoreCache } from './score-cache.entity';
import { FileContent } from './file-content.entity';
import { TeamCategory } from './team-category.entity';
import { ContestProblem } from './contest-problem.entity';

export const entities = [
  User,
  Role,
  Team,
  File,
  Contest,
  Problem,
  Language,
  Testcase,
  JudgeHost,
  Executable,
  ScoreCache,
  Submission,
  FileContent,
  TeamCategory,
  ContestProblem,
];

export * from './user.entity';
export * from './role.entity';
export * from './team.entity';
export * from './file.entity';
export * from './contest.entity';
export * from './problem.entity';
export * from './testcase.entity';
export * from './language.entity';
export * from './executable.entity';
export * from './submission.entity';
export * from './judge-host.entity';
export * from './score-cache.entity';
export * from './file-content.entity';
export * from './team-category.entity';
export * from './contest-problem.entity';
