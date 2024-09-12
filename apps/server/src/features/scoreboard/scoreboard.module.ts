import { forwardRef, Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { ScoreCache } from '../../entities';
import { ContestsModule } from '../contests/contests.module';
import { SubmissionsModule } from '../submissions/submissions.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { ScoreCacheService } from './score-cache.service';
import { ScoreboardService } from './scoreboard.service';

@Module({
  imports: [forwardRef(() => ContestsModule), forwardRef(() => SubmissionsModule), WebsocketModule],
  providers: [ScoreboardService, ScoreCacheService, CustomRepositoryProvider(ScoreCache)],
  exports: [ScoreboardService, ScoreCacheService],
})
export class ScoreboardModule {}
