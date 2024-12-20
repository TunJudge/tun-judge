import { User } from '@core/prisma';

export function compareRoles(currentUser: User, sendingUser: User): boolean {
  if (currentUser.roleName === 'team') {
    return sendingUser.roleName === 'team';
  }

  return sendingUser.roleName !== 'team';
}
