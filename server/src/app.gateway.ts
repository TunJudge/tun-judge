import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities';
import { ExtendedRepository } from './core/extended-repository';

type UpdateEvents =
  | 'contests'
  | 'scoreboard'
  | 'submissions'
  | 'judgings'
  | 'judgeRuns';

@WebSocketGateway({ namespace: 'ws' })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>,
  ) {}

  pingForUpdates(...events: UpdateEvents[]) {
    events.forEach((event) => this.server.emit(event, true));
  }

  @SubscribeMessage('subscribe')
  subscribe(client: Socket) {
    if (
      ['admin', 'jury'].includes(
        client.request.session?.passport?.user.role.name,
      )
    ) {
      client.join('juries');
    }
  }

  @SubscribeMessage('judgeHostLogs')
  judgeHostLogs(
    @MessageBody() { hostname, log }: { hostname: string; log: string },
  ) {
    this.server.in('juries').emit(`judgeHost-${hostname}-logs`, log);
  }
}
