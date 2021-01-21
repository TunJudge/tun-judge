import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import session from './session';

export class EventsAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): Server {
    const server: Server = super.createIOServer(port, options);
    server.use((socket, next) =>
      session(socket.request, socket.request.res || {}, next),
    );
    return server;
  }
}
