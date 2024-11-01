import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { LogClass } from '../logger';
import { AbstractInitializer } from './abstract-initializer';

@LogClass
@Injectable()
export class LanguagesInitializer extends AbstractInitializer {
  async _run(prisma: PrismaClient): Promise<void> {
    const languages = await this.parseDirectory('languages');

    for (const language of languages) {
      if (await prisma.language.findFirst({ where: { name: language.name } })) {
        continue;
      }

      language.buildScript = {
        connect: {
          name: (
            await this.createFileEntity(prisma, language.buildScript, ['Languages', language.name])
          ).name,
        },
      };

      await prisma.language.create({ data: language });
    }
  }
}
