import { INestApplicationContext } from '@nestjs/common';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';
import {
  AbstractWsAdapter,
  MessageMappingProperties,
} from '@nestjs/websockets';
import { DISCONNECT_EVENT } from '@nestjs/websockets/constants';
import { Request, Response } from 'express';
import { fromEvent, Observable } from 'rxjs';
import { filter, first, map, mergeMap, share, takeUntil } from 'rxjs/operators';
import { Namespace, Server } from 'socket.io';
import session from './session';

// TODO: Using this until socket.io v3 is part of Nest.js, see: https://github.com/nestjs/nest/issues/5676
export class SocketIoAdapter extends AbstractWsAdapter {
  constructor(appOrHttpServer?: INestApplicationContext | any) {
    super(appOrHttpServer);
  }

  public create(
    port: number,
    options?: any & { namespace?: string; server?: any },
  ): Server | Namespace {
    if (!options) {
      return this.createIOServer(port);
    }
    const { namespace, server, ...opt } = options;
    const _server =
      server && isFunction(server.of)
        ? server.of(namespace)
        : namespace
        ? this.createIOServer(port, opt).of(namespace)
        : this.createIOServer(port, opt);
    if (server) {
      (_server as Namespace).use((socket, next) =>
        session(
          socket.request as Request,
          (socket.request as Request).res ?? ({} as Response),
          () => next(),
        ),
      );
    }
    return _server;
  }

  public createIOServer(port: number, options?: any): any {
    if (this.httpServer && port === 0) {
      return new Server(this.httpServer);
    }
    return new Server(port, options);
  }

  public bindMessageHandlers(
    client: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ) {
    const disconnect$ = fromEvent(client, DISCONNECT_EVENT).pipe(
      share(),
      first(),
    );

    handlers.forEach(({ message, callback }) => {
      const source$ = fromEvent(client, message).pipe(
        mergeMap((payload: any) => {
          const { data, ack } = this.mapPayload(payload);
          return transform(callback(data, ack)).pipe(
            filter((response: any) => !isNil(response)),
            map((response: any) => [response, ack]),
          );
        }),
        takeUntil(disconnect$),
      );
      source$.subscribe(([response, ack]) => {
        if (response.event) {
          return client.emit(response.event, response.data);
        }
        isFunction(ack) && ack(response);
      });
    });
  }

  public mapPayload(payload: any): { data: any; ack?: () => any } {
    if (!Array.isArray(payload)) {
      return { data: payload };
    }
    const lastElement = payload[payload.length - 1];
    const isAck = isFunction(lastElement);
    if (isAck) {
      const size = payload.length - 1;
      return {
        data: size === 1 ? payload[0] : payload.slice(0, size),
        ack: lastElement,
      };
    }
    return { data: payload };
  }
}
