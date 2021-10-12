import { Role } from './role.model';
import { Team } from './team.model';

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  lastLogin: Date;
  lastIpAddress: string;
  enabled: boolean;
  role: Role;
  team?: Team;
}
