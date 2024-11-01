import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { LogClass } from '../logger';
import { AbstractInitializer } from './abstract-initializer';

@LogClass
@Injectable()
export class ContestsInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const contests = await this.parseMetadataFile('contests.json');

    for (const contest of contests) {
      contest.teams = {
        createMany: {
          data: await Promise.all(
            contest.teams.map(async (name: string) => ({
              teamId: (await prisma.team.findFirst({ where: { name } })).id,
            })),
          ),
        },
      };

      contest.problems = {
        createMany: {
          data: await Promise.all(
            contest.problems.map(async ({ problemName, ...problem }) => ({
              ...problem,
              problemId: (await prisma.problem.findFirst({ where: { name: problemName } })).id,
            })),
          ),
        },
      };

      await prisma.contest.create({ data: contest });
    }
  }
}
