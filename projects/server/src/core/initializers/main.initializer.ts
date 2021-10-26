import { Injectable } from '@nestjs/common';

import { InitialDataEntity } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';
import { ContestsInitializer } from './contests.initializer';
import { ExecutablesInitializer } from './executables.initializer';
import { LanguagesInitializer } from './languages.initializer';
import { ProblemsInitializer } from './problems.initializer';
import { RolesInitializer } from './roles.initializer';
import { TeamCategoriesInitializer } from './team-categories.initializer';
import { TeamsInitializer } from './teams.initializer';
import { UsersInitializer } from './users.initializer';

@Injectable()
export class MainInitializer extends AbstractInitializer {
  constructor(
    private readonly rolesInitializer: RolesInitializer,
    private readonly usersInitializer: UsersInitializer,
    private readonly teamCategoriesInitializer: TeamCategoriesInitializer,
    private readonly teamsInitializer: TeamsInitializer,
    private readonly executablesInitializer: ExecutablesInitializer,
    private readonly languagesInitializer: LanguagesInitializer,
    private readonly problemsInitializer: ProblemsInitializer,
    private readonly contestsInitializer: ContestsInitializer
  ) {
    super();
  }

  async run(entityManager): Promise<void> {
    if (await entityManager.count(InitialDataEntity)) return;

    await this.rolesInitializer.run(entityManager);
    await this.usersInitializer.run(entityManager);

    await this.teamCategoriesInitializer.run(entityManager);
    await this.teamsInitializer.run(entityManager);

    await this.executablesInitializer.run(entityManager);
    await this.languagesInitializer.run(entityManager);
    await this.problemsInitializer.run(entityManager);
    await this.contestsInitializer.run(entityManager);

    await entityManager.save(InitialDataEntity, { date: new Date() });
  }
}
