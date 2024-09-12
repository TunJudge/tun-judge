import { Injectable } from '@nestjs/common';

import { Language } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class LanguagesInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const languages = await this.parseFolder('languages');
    for (const language of languages) {
      language.buildScript = await this.createFileEntity(language.buildScript, entityManager);
    }
    return entityManager.save(Language, languages);
  }
}
