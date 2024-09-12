import { Injectable } from '@nestjs/common';

import { Team, TeamCategory, User } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class TeamsInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const teams = await this.parseMetadataFile('teams.json');
    for (const team of teams) {
      team.category = await entityManager.findOne(TeamCategory, team.category);
      team.users = await Promise.all(team.users.map((user) => entityManager.findOne(User, user)));
    }
    return entityManager.save(Team, teams);
  }
}
