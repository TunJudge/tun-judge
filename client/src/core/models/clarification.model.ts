import { ClarificationMessage } from './clarification-message.model';
import { Contest } from './contest.model';
import { Problem } from './problem.model';
import { Team } from './team.model';

export interface Clarification {
  id: number;
  general: boolean;
  messages: ClarificationMessage[];
  contest: Contest;
  problem: Problem;
  team: Team;
}
