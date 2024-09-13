import { Module, forwardRef } from '@nestjs/common';

import { JudgeHostsModule } from '../judge-hosts/judge-hosts.module';
import { TeamsModule } from '../teams/teams.module';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [forwardRef(() => JudgeHostsModule), TeamsModule],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
