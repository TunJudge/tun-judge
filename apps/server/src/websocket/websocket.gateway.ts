import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Server, Socket } from 'socket.io';

import { Clarification, Prisma, PrismaClient } from '@prisma/client';

import { WebSocketEvent } from '@tun-judge/shared';

import { LogClass } from '../logger';
import { Session, User } from '../types';

type Rooms = 'juries' | 'judgeHosts' | `team-${number}`;

@LogClass
@WebSocketGateway({ namespace: 'ws' })
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  readonly server: Server;
  readonly prisma: PrismaClient = new PrismaClient();

  constructor(private readonly cls: ClsService) {}

  pingForUpdates(room: Rooms | 'all', ...events: WebSocketEvent[]) {
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

  spyOn(prisma: PrismaClient) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias

    return prisma.$extends({
      name: 'db-events',
      model: {
        submission: this.createOnCreateListener(prisma, 'submission', ['create', 'update'], () => [
          ['all', ['submissions', 'judgingRuns']],
        ]),
        clarification: this.createOnCreateListener(
          prisma,
          'clarification',
          'create',
          (clarification: Clarification) => {
            const user = this.cls.get('auth') as User;

            return [
              user.roleName === 'team'
                ? ['juries', ['clarifications']]
                : [
                    clarification.teamId ? `team-${clarification.teamId}` : 'all',
                    ['clarifications'],
                  ],
            ];
          },
        ),
        judging: this.createOnCreateListener(
          prisma,
          'judging',
          ['create', 'update'],
          (judging: Prisma.JudgingGetPayload<{ include: { submission: true } }>) => {
            const updates: [room: Rooms | 'all', events: WebSocketEvent[]][] = [
              ['juries', ['judgings', 'submissions']],
            ];

            if ('submission' in judging) {
              updates.push([`team-${judging.submission.teamId}`, ['submissions']]);
            }

            return updates;
          },
        ),
        judgingRun: this.createOnCreateListener(prisma, 'judgingRun', 'create', () => [
          ['juries', ['judgingRuns']],
        ]),
      },
    });
  }

  private createOnCreateListener(
    prisma: PrismaClient,
    entity: string,
    method: string | string[],
    contextBuilder: (item: unknown) => [room: Rooms | 'all', events: WebSocketEvent[]][],
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const socket = this;
    const methodArray = Array.isArray(method) ? method : [method];

    return methodArray.reduce(
      (prev, method) => ({
        ...prev,
        async [method]<T, A>(
          this: T,
          args: Prisma.Exact<A, Prisma.Args<T, 'create'>>,
        ): Promise<Prisma.Result<T, A, 'create'>> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await prisma[entity][method](args as any);

          for (const [room, events] of contextBuilder(result)) {
            socket.pingForUpdates(room, ...events);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return result as any;
        },
      }),
      {},
    );
  }
}
