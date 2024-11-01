import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server, Socket } from 'socket.io';

import { PrismaClient } from '@prisma/client';

import { LogClass } from '../logger';
import { Session, User } from '../types';

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
  readonly server: Server;
  readonly prisma: PrismaClient = new PrismaClient();

  pingForUpdates(room: Rooms | 'all', ...events: UpdateEvents[]) {
    events.forEach((event) =>
      room === 'all' ? this.server.emit(event, true) : this.server.in(room).emit(event, true),
    );
  }

  async handleConnection(client: Socket) {
    const user: User = ((client.request as Request).session as unknown as Session)?.passport?.user;
    const roleName = user?.role.name;
    if (['admin', 'jury'].includes(roleName)) {
      client.join('juries');
    } else if (roleName === 'judge-host') {
      client.join('judgeHosts');
    } else if (roleName === 'team') {
      client.join(`team-${user.teamId}`);
    }
  }

  @SubscribeMessage('judge-host-ping')
  async judgeHostPing(client: Socket, hostname: string) {
    const user: User = ((client.request as Request).session as unknown as Session)?.passport?.user;

    await this.prisma.judgeHost.upsert({
      where: { hostname },
      create: { hostname, userId: user.id, active: true, pollTime: new Date() },
      update: { pollTime: new Date() },
    });
  }

  pingForNewSubmissions() {
    this.server.in('judgeHosts').emit('new-submission');
  }

  @SubscribeMessage('judgeHostLogs')
  judgeHostLogs(@MessageBody() { hostname, log }: { hostname: string; log: string }) {
    this.server.in('juries').emit(`judgeHost-${hostname}-logs`, log);
  }
}
