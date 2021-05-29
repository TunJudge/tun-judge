import { Injectable } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import config from '../config';

@Injectable()
export class SocketService {
  private readonly socket: Socket;

  constructor() {
    this.socket = io(`${config.url}/ws`, {
      transports: ['websocket'],
    });
  }

  get connected(): boolean {
    return this.socket.connected;
  }

  emitLogLine(logLine: string): void {
    this.socket.emit('judgeHostLogs', {
      hostname: config.hostname,
      log: logLine,
    });
  }
}
