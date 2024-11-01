import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{
  include: { role: true; team: true };
}>;

export type Session = {
  passport: {
    user: User;
  };
};
