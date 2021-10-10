import { Module } from '@nestjs/common';
import { CustomRepositoryProvider } from '../../core/extended-repository';
import { TeamCategory } from '../../entities';
import { TeamCategoriesController } from './team-categories.controller';
import { TeamCategoriesService } from './team-categories.service';

@Module({
  controllers: [TeamCategoriesController],
  providers: [TeamCategoriesService, CustomRepositoryProvider(TeamCategory)],
  exports: [TeamCategoriesService],
})
export class TeamCategoriesModule {}
