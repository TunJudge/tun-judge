import { Module } from '@nestjs/common';

import { WebsocketModule } from '../websocket/websocket.module';
import { ScoreboardController } from './scoreboard.controller';
import { ScoreboardService } from './scoreboard.service';

@Module({
  imports: [WebsocketModule],
  controllers: [ScoreboardController],
  providers: [ScoreboardService],
  exports: [ScoreboardService],
})
export class ScoreboardModule {}
