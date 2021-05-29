import { SocketService } from '../services';

export * from './judge.logger';

export function getOnLog(socketService: SocketService): (log: string) => void {
  return (log) => socketService.connected && socketService.emitLogLine(log);
}
