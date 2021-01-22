import { Contest } from './contest.model';
import { File } from './file.model';
import { JudgeHost } from './judge-host.model';
import { Submission } from './submission.model';
import { User } from './user.model';

export interface Judging {
  id: number;
  startTime: Date;
  endTime: Date;
  result: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';
  verified: boolean;
  verifyComment: string;
  valid: boolean;
  compileOutput: File;
  juryMember: User;
  contest: Contest;
  judgeHost: JudgeHost;
  submission: Submission;
}
