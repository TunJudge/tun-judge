import { Role } from './role.model';

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
}
