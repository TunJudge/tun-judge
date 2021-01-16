import { User } from './user.model';

export interface JudgeHost {
  id: number;
  hostname: string;
  active: boolean;
  pollTime: Date;
  user: User;
}
