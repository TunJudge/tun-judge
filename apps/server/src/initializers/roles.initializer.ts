import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { LogClass } from '../logger';
import { AbstractInitializer } from './abstract-initializer';

@LogClass
@Injectable()
export class RolesInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const roles = await this.parseMetadataFile('roles.json');

    await prisma.role.createMany({ data: roles, skipDuplicates: true });
  }
}
