import { User } from './user.model';
import { TeamCategory } from './team-category.model';
import { Contest } from './contest.model';

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
