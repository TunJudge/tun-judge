import { Module } from '@nestjs/common';
import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Team } from '../../entities';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, CustomRepositoryProvider(Team)],
  exports: [TeamsService],
})
export class TeamsModule {}
