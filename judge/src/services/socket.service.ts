import { io, Socket } from 'socket.io-client';
import config from '../config';

export class SocketService {
  private socket: Socket = io(`${config.url}/ws`, {
    transports: ['websocket'],
  });

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

const socketService = new SocketService();

export default socketService;
