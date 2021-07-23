import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LogClass } from '../../core/log.decorator';
import { JudgeHostsService } from '../judge-hosts/judge-hosts.service';

type UpdateEvents = 'contests' | 'scoreboard' | 'submissions' | 'judgings' | 'judgeRuns';

@LogClass
@WebSocketGateway({ namespace: 'ws' })
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly judgeHostsService: JudgeHostsService) {}

  pingForUpdates(...events: UpdateEvents[]) {
    events.forEach((event) => this.server.emit(event, true));
  }

  @SubscribeMessage('subscribe')
  subscribe(client: Socket) {
    const roleName = (client.request as any).session?.passport?.user.role.name;
    if (['admin', 'jury'].includes(roleName)) {
      client.join('juries');
    } else if (roleName === 'judge-host') {
      client.join('judgeHosts');
    }
  }

  @SubscribeMessage('judge-host-ping')
  async judgeHostPing(client: Socket, hostname: string) {
    await this.judgeHostsService.update({ hostname }, { pollTime: new Date() });
  }

  pingForNewSubmissions() {
    this.server.in('judgeHosts').emit('new-submission');
  }

  @SubscribeMessage('judgeHostLogs')
  judgeHostLogs(@MessageBody() { hostname, log }: { hostname: string; log: string }) {
    this.server.in('juries').emit(`judgeHost-${hostname}-logs`, log);
  }
}
