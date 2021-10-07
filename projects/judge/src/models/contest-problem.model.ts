import { Contest } from './contest.model';
import { Problem } from './problem.model';

export interface ContestProblem {
  contest: Contest;
  problem: Problem;
  shortName: string;
  points: number;
  allowSubmit: boolean;
  allowJudge: boolean;
  color: string;
}
