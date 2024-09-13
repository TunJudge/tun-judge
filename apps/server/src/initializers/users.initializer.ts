import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class UsersInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const users = await this.parseMetadataFile('users.json');

    await prisma.user.createMany({ data: users, skipDuplicates: true });
  }
}
