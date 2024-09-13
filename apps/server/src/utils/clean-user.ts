import { User } from '@prisma/client';

import { cleanFields } from './clean-fields';

export function cleanUser(user: User): User {
  return cleanFields(user, 'password', 'sessionId');
}
