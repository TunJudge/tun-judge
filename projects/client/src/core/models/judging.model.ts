import { Contest } from './contest.model';
import { File } from './file.model';
import { JudgeHost } from './judge-host.model';
import { JudgingRun } from './judging-run.model';
import { Submission } from './submission.model';
import { User } from './user.model';

export type JudgingResult = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'SE';

export interface Judging {
  id: number;
  startTime: Date;
  endTime: Date;
  result: JudgingResult;
  systemError: string;
  verified: boolean;
  verifyComment: string;
  valid: boolean;
  compileOutput: File;
  juryMember: User;
  contest: Contest;
  judgeHost: JudgeHost;
  submission: Submission;
  runs: JudgingRun[];
}
