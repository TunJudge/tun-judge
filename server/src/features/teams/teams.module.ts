import { Module } from '@nestjs/common';
import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Team } from '../../entities';
import { TeamCategoriesModule } from '../team-categories/team-categories.module';
import { UsersModule } from '../users/users.module';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  imports: [TeamCategoriesModule, UsersModule],
  providers: [TeamsService, CustomRepositoryProvider(Team)],
  exports: [TeamsService],
})
export class TeamsModule {}
