import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Contest, ContestProblem } from '../../entities';
import { ClarificationsModule } from '../clarifications/clarifications.module';
import { LanguagesModule } from '../languages/languages.module';
import { ProblemsModule } from '../problems/problems.module';
import { ScoreboardModule } from '../scoreboard/scoreboard.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { TeamsModule } from '../teams/teams.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { ContestProblemsService } from './contest-problems.service';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';

@Module({
  controllers: [ContestsController],
  imports: [
    ClarificationsModule,
    LanguagesModule,
    ProblemsModule,
    ScoreboardModule,
    SubmissionsModule,
    TeamsModule,
    WebsocketModule,
  ],
  providers: [
    ContestsService,
    ContestProblemsService,
    CustomRepositoryProvider(Contest),
    CustomRepositoryProvider(ContestProblem),
  ],
  exports: [ContestsService, ContestProblemsService],
})
export class ContestsModule {}
