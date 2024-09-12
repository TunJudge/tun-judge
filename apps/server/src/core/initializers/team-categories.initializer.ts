import { Injectable } from '@nestjs/common';

import { TeamCategory } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class TeamCategoriesInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const teamCategories = await this.parseMetadataFile('team-categories.json');
    return entityManager.save(TeamCategory, teamCategories);
  }
}
