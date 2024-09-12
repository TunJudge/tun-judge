import { Module } from '@nestjs/common';

import { ContestsInitializer } from './contests.initializer';
import { ExecutablesInitializer } from './executables.initializer';
import { LanguagesInitializer } from './languages.initializer';
import { MainInitializer } from './main.initializer';
import { ProblemsInitializer } from './problems.initializer';
import { RolesInitializer } from './roles.initializer';
import { TeamCategoriesInitializer } from './team-categories.initializer';
import { TeamsInitializer } from './teams.initializer';
import { UsersInitializer } from './users.initializer';

@Module({
  providers: [
    RolesInitializer,
    UsersInitializer,
    TeamCategoriesInitializer,
    TeamsInitializer,
    ExecutablesInitializer,
    LanguagesInitializer,
    ProblemsInitializer,
    ContestsInitializer,
    MainInitializer,
  ],
  exports: [MainInitializer],
})
export class InitializersModule {}
