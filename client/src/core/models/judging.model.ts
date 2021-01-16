import { File } from './file.model';
import { Submission } from './submission.model';
import { JudgeHost } from './judge-host.model';
import { Contest } from './contest.model';
import { User } from './user.model';

export interface Judging {
  id: number;
  startTime: Date;
  endTime: Date;
  result: string;
  verified: boolean;
  verifyComment: string;
  valid: boolean;
  compileOutput: File;
  juryMember: User;
  contest: Contest;
  judgeHost: JudgeHost;
  submission: Submission;
}
