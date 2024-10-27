import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClient, User } from '@prisma/client';

import { LogClass, LogParam } from '../logger';
import { checkPassword, cleanUser, throwError } from '../utils';

@LogClass
@Injectable()
export class AuthService {
  async validateUser(
    @LogParam('username') username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const prisma = new PrismaClient();
    const user =
      (await prisma.user.findUnique({
        where: { username },
        include: { role: true, team: true },
      })) ?? throwError<User>(new NotFoundException());

    if (checkPassword(user, password)) return cleanUser(user);

    throw new Error('Incorrect Password');
  }
}
