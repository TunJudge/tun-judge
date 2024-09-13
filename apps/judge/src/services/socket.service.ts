import { Injectable } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';

import config from '../config';
import http from '../http/http.client';

@Injectable()
export class SocketService {
  private readonly socket: Socket;

  constructor() {
    const Cookie = http.cookieJar.getCookiesSync(http.url)[0]?.cookieString();
    this.socket = io(`${config.url}/ws`, {
      transports: ['websocket'],
      extraHeaders: { Cookie },
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
