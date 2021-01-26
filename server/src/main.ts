import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { AppModule } from './app.module';
import config from './core/config';
import session from './core/session';
import { SocketIoAdapter } from './core/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (config.nodeEnv === 'development') {
    app.enableCors({
      origin: /.*/,
      credentials: true,
    });
  }
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(session);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
