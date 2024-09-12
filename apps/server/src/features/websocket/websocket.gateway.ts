import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { LogClass } from '../../core/log.decorator';
import { User } from '../../entities';
import { JudgeHostsService } from '../judge-hosts/judge-hosts.service';
import { TeamsService } from '../teams/teams.service';

type UpdateEvents =
  | 'contests'
  | 'scoreboard'
  | 'submissions'
  | 'judgings'
  | 'judgeRuns'
  | 'clarifications';

type Rooms = 'juries' | 'judgeHosts' | `team-${number}`;

@LogClass
@WebSocketGateway({ namespace: 'ws' })
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly judgeHostsService: JudgeHostsService,
    private readonly teamsService: TeamsService
  ) {}

  pingForUpdates(room: Rooms | 'all', ...events: UpdateEvents[]) {
    events.forEach((event) =>
      room === 'all' ? this.server.emit(event, true) : this.server.in(room).emit(event, true)
    );
  }

  async handleConnection(client: Socket) {
    const user: User = (client.request as any).session?.passport?.user;
    const roleName = user?.role.name;
    if (['admin', 'jury'].includes(roleName)) {
      client.join('juries');
    } else if (roleName === 'judge-host') {
      client.join('judgeHosts');
    } else if (roleName === 'team') {
      const team = await this.teamsService.getByUserId(user.id);
      client.join(`team-${team.id}`);
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
