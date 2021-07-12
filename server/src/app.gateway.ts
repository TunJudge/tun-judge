import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExtendedRepository } from './core/extended-repository';
import { LogClass } from './core/log.decorator';
import { JudgeHost, Team } from './entities';

type UpdateEvents = 'contests' | 'scoreboard' | 'submissions' | 'judgings' | 'judgeRuns';

@LogClass
@WebSocketGateway({ namespace: 'ws' })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>,
    @InjectRepository(JudgeHost)
    private readonly judgeHostsRepository: ExtendedRepository<JudgeHost>,
  ) {}

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
    await this.judgeHostsRepository.update({ hostname }, { pollTime: new Date() });
  }

  pingForNewSubmissions() {
    this.server.in('judgeHosts').emit('new-submission');
  }

  @SubscribeMessage('judgeHostLogs')
  judgeHostLogs(@MessageBody() { hostname, log }: { hostname: string; log: string }) {
    this.server.in('juries').emit(`judgeHost-${hostname}-logs`, log);
  }
}
