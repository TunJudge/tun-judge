import { Contest } from './contest.model';
import { File } from './file.model';
import { JudgeHost } from './judge-host.model';
import { Judging } from './judging.model';
import { Language } from './language.model';
import { Problem } from './problem.model';
import { Team } from './team.model';

export interface Submission {
  id: number;
  submitTime: Date;
  valid: boolean;
  contest: Contest;
  team: Team;
  problem: Problem;
  language: Language;
  judgeHost: JudgeHost;
  originalSubmission: Submission;
  file: File;
  judgings: Judging[];
}
