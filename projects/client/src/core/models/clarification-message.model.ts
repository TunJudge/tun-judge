import { Clarification } from './clarification.model';
import { User } from './user.model';

export interface ClarificationMessage {
  id: number;
  content: string;
  sentBy: User;
  sentTime: Date;
  seenBy: User[];
  clarification: Clarification;
}
