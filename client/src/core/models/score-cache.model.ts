import { Contest } from './contest.model';
import { Team } from './team.model';
import { Problem } from './problem.model';

export interface ScoreCache {
  contest: Contest;
  team: Team;
  problem: Problem;
  submissions: number;
  pending: number;
  solveTime: Date;
  correct: boolean;
  firstToSolve: boolean;
  restrictedPending: number;
  restrictedSolveTime: Date;
  restrictedCorrect: boolean;
}
