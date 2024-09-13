import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Submission } from '../../entities';
import { FilesModule } from '../files/files.module';
import { JudgeHostsModule } from '../judge-hosts/judge-hosts.module';
import { ScoreboardModule } from '../scoreboard/scoreboard.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';

@Module({
  controllers: [SubmissionsController],
  imports: [FilesModule, JudgeHostsModule, ScoreboardModule, WebsocketModule],
  providers: [SubmissionsService, CustomRepositoryProvider(Submission)],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
