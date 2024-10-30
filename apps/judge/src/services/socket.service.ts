import { Injectable } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';

import config from '../config';
import { cookieStore } from '../http/http.client';

@Injectable()
export class SocketService {
  private readonly socket: Socket;

  constructor() {
    this.socket = io(`${config.url}/ws`, {
      transports: ['websocket'],
      extraHeaders: { Cookie: cookieStore.getCookieStringSync(config.url) },
    });
  }

  get connected(): boolean {
    return this.socket.connected;
  }

  ping(): void {
    this.socket.emit('judge-host-ping', config.hostname);
  }

  onNewSubmission(callback: () => void): void {
    this.socket.on('new-submission', callback);
  }

  emitLogLine(logLine: string): void {
    this.socket.emit('judgeHostLogs', {
      hostname: config.hostname,
      log: logLine,
    });
  }
}
