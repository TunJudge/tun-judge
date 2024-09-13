import { compareSync } from 'bcrypt';

import { User } from '@prisma/client';

export function checkPassword(user: User, password: string): boolean {
  return compareSync(password, user.password);
}
