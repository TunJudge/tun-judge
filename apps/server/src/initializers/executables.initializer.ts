import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class ExecutablesInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const executables = await this.parseDirectory('executables');

    for (const executable of executables) {
      if (await prisma.executable.findFirst({ where: { name: executable.name } })) {
        continue;
      }

      executable.sourceFile = {
        connect: {
          name: (
            await this.createFileEntity(prisma, executable.sourceFile, [
              'Executables',
              executable.name,
            ])
          ).name,
        },
      };

      if (executable.type === 'CHECKER') {
        executable.buildScript = {
          connect: {
            name: (
              await this.createFileEntity(prisma, executable.buildScript, [
                'Executables',
                executable.name,
              ])
            ).name,
          },
        };
      }

      await prisma.executable.create({ data: executable });
    }
  }
}
