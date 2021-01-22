import { Contest } from './contest.model';
import { TeamCategory } from './team-category.model';
import { User } from './user.model';

export interface Team {
  id: number;
  name: string;
  enabled: boolean;
  members: string;
  room: string;
  comments: string;
  penalty: number;
  user: User;
  category: TeamCategory;
  contests: Contest[];
}
