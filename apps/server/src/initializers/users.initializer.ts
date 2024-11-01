import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';

import { PrismaClient } from '@prisma/client';

import { LogClass } from '../logger';
import { AbstractInitializer } from './abstract-initializer';

@LogClass
@Injectable()
export class UsersInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const users = await this.parseMetadataFile('users.json');

    for (const user of users) {
      user.password = await hash(
        user.password || Math.random().toString(36).substring(2),
        await genSalt(10),
      );
    }

    await prisma.user.createMany({ data: users, skipDuplicates: true });
  }
}
