import { Contest } from './contest.model';
import { Problem } from './problem.model';

export interface ContestProblem {
  id: string;
  contest: Contest;
  problem: Problem;
  shortName: string;
  points: number;
  allowSubmit: boolean;
  allowJudge: boolean;
  color: string;
}
