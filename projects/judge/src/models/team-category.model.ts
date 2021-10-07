import { Team } from './team.model';

export interface TeamCategory {
  id: number;
  name: string;
  sortOrder: number;
  color: string;
  visible: boolean;
  teams: Team[];
}
