import { WebsocketGateway } from './websocket.gateway';

export class WebsocketModule {
  static forRoot() {
    return {
      global: true,
      module: WebsocketModule,
      providers: [WebsocketGateway],
      exports: [WebsocketGateway],
    };
  }
}
