import { Role } from './role.model';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  lastLogin: Date;
  lastIpAddress: Date;
  enabled: boolean;
  roles: Role[];
}
