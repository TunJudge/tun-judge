import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';

import { User } from '@prisma/client';

import { PrismaService } from '../db';
import { LogClass, LogParam } from '../logger';
import { checkPassword, cleanUser, throwError } from '../utils';

@LogClass
@Injectable()
export class AuthService {
  constructor(@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaService) {}

  async validateUser(
    @LogParam('username') username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user =
      (await this.prisma.user.findUnique({
        where: { username },
        include: { role: true },
      })) ?? throwError<User>(new NotFoundException());

    if (checkPassword(user, password)) return cleanUser(user);

    throw new Error('Incorrect Password');
  }
}
