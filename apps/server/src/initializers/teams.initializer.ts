import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class TeamsInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const teams = await this.parseMetadataFile('teams.json');

    for (const team of teams) {
      team.category = {
        connect: {
          id: (await prisma.teamCategory.findFirst({ where: { name: team.category } })).id,
        },
      };
      team.users = {
        connect: team.users.map((username: string) => ({ username })),
      };

      await prisma.team.create({ data: team });
    }
  }
}
