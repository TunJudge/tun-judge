import { User } from '@prisma/client';

import { Clarification } from '@core/components';

import { compareRoles } from './compareRoles';

export function countUnseenMessages(clarification: Clarification, currentUser: User): number {
  return clarification.messages.filter(
    (message) =>
      !compareRoles(currentUser, message.sentBy) &&
      !message.seenBy.some((u) => u.userId === currentUser.id),
  ).length;
}
