import { Clarification } from './clarification.model';
import { User } from './user.model';

export interface ClarificationMessage {
  id: number;
  content: string;
  sentBy: User;
  sentTime: Date;
  seen: boolean;
  clarification: Clarification;
}
