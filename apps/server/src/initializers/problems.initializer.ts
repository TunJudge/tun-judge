import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { LogClass } from '../logger';
import { AbstractInitializer } from './abstract-initializer';

@LogClass
@Injectable()
export class ProblemsInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const problems = await this.parseDirectory('problems');

    for (const problem of problems) {
      if (await prisma.problem.findFirst({ where: { name: problem.name } })) {
        continue;
      }

      problem.statementFile = {
        connect: {
          name: (
            await this.createFileEntity(prisma, problem.statementFile, ['Problems', problem.name])
          ).name,
        },
      };
      problem.runScript = {
        connect: {
          id: (await prisma.executable.findFirst({ where: { name: problem.runScript } })).id,
        },
      };
      problem.checkScript = {
        connect: {
          id: (await prisma.executable.findFirst({ where: { name: problem.checkScript } })).id,
        },
      };
      problem.testcases = {
        createMany: {
          data: await Promise.all(
            problem.testcases.map(async ({ inputFile, outputFile, ...testcase }) => ({
              ...testcase,
              inputFileName: (
                await this.createFileEntity(prisma, inputFile, [
                  'Problems',
                  problem.name,
                  'Testcases',
                ])
              ).name,
              outputFileName: (
                await this.createFileEntity(prisma, outputFile, [
                  'Problems',
                  problem.name,
                  'Testcases',
                ])
              ).name,
            })),
          ),
        },
      };

      await prisma.problem.create({ data: problem });
    }
  }
}
