import { forwardRef, Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { JudgeHost, Judging, JudgingRun } from '../../entities';
import { ScoreboardModule } from '../scoreboard/scoreboard.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { UsersModule } from '../users/users.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { JudgeHostsController } from './judge-hosts.controller';
import { JudgeHostsService } from './judge-hosts.service';
import { JudgingRunsService } from './judging-runs.service';
import { JudgingsService } from './judgings.service';

@Module({
  controllers: [JudgeHostsController],
  imports: [ScoreboardModule, forwardRef(() => SubmissionsModule), UsersModule, WebsocketModule],
  providers: [
    JudgeHostsService,
    JudgingsService,
    JudgingRunsService,
    CustomRepositoryProvider(JudgeHost),
    CustomRepositoryProvider(Judging),
    CustomRepositoryProvider(JudgingRun),
  ],
  exports: [JudgeHostsService, JudgingsService, JudgingRunsService],
})
export class JudgeHostsModule {}
