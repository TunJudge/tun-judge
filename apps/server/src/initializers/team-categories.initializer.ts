import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class TeamCategoriesInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const teamCategories = await this.parseMetadataFile('team-categories.json');

    await prisma.teamCategory.createMany({ data: teamCategories, skipDuplicates: true });
  }
}