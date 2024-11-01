import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { FilesStorage } from '../files-storage';
import { LogClass } from '../logger';
import { AbstractInitializer } from './abstract-initializer';
import { ContestsInitializer } from './contests.initializer';
import { ExecutablesInitializer } from './executables.initializer';
import { LanguagesInitializer } from './languages.initializer';
import { ProblemsInitializer } from './problems.initializer';
import { RolesInitializer } from './roles.initializer';
import { TeamCategoriesInitializer } from './team-categories.initializer';
import { TeamsInitializer } from './teams.initializer';
import { UsersInitializer } from './users.initializer';

@LogClass
@Injectable()
export class MainInitializer extends AbstractInitializer {
  constructor(
    private readonly filesStorage: FilesStorage,
    private readonly rolesInitializer: RolesInitializer,
    private readonly usersInitializer: UsersInitializer,
    private readonly teamCategoriesInitializer: TeamCategoriesInitializer,
    private readonly teamsInitializer: TeamsInitializer,
    private readonly executablesInitializer: ExecutablesInitializer,
    private readonly languagesInitializer: LanguagesInitializer,
    private readonly problemsInitializer: ProblemsInitializer,
    private readonly contestsInitializer: ContestsInitializer,
  ) {
    AbstractInitializer.uploadFile = (fileName) => this.filesStorage.upload(fileName);
    AbstractInitializer.createDirectory = (directoryName) =>
      this.filesStorage.createDirectory(directoryName);
    super();
  }

  async _run(prisma: PrismaClient): Promise<void> {
    await this.rolesInitializer.run('roles', prisma);
    await this.usersInitializer.run('users', prisma);

    await this.teamCategoriesInitializer.run('teamCategories', prisma);
    await this.teamsInitializer.run('teams', prisma);

    await this.executablesInitializer.run('executables', prisma);
    await this.languagesInitializer.run('languages', prisma);
    await this.problemsInitializer.run('problems', prisma);
    await this.contestsInitializer.run('contests', prisma);
  }
}
