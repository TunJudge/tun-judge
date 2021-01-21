import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { AppModule } from './app.module';
import config from './core/config';
import { EventsAdapter } from './core/events.adapter';
import session from './core/session';

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
  app.useWebSocketAdapter(new EventsAdapter(app));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
