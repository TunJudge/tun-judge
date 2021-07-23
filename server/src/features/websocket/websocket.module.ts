import { forwardRef, Module } from '@nestjs/common';
import { JudgeHostsModule } from '../judge-hosts/judge-hosts.module';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [forwardRef(() => JudgeHostsModule)],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
