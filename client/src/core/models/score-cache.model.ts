import { Contest } from './contest.model';
import { Problem } from './problem.model';
import { Team } from './team.model';

export interface ScoreCache {
  contest: Contest;
  team: Team;
  problem: Problem;
  correct: boolean;
  pending: number;
  solveTime: Date;
  submissions: number;
  firstToSolve: boolean;
  restrictedCorrect: boolean;
  restrictedPending: number;
  restrictedSolveTime: Date;
  restrictedSubmissions: number;
  restrictedFirstToSolve: boolean;
}
