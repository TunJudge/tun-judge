import { ContestProblem } from './contest-problem.model';
import { Team } from './team.model';

export interface Contest {
  id: number;
  name: string;
  shortName: string;
  activateTime: Date;
  startTime: Date;
  freezeTime: Date;
  endTime: Date;
  unfreezeTime: Date;
  enabled: boolean;
  processBalloons: boolean;
  public: boolean;
  openToAllTeams: boolean;
  verificationRequired: boolean;
  problems: ContestProblem[];
  teams: Team[];
}
