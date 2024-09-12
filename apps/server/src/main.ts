import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as SwaggerStats from 'swagger-stats';

import { version } from '../../../package.json';
import { AppModule } from './app.module';
import config from './core/config';
import session from './core/session';
import { SocketIoAdapter } from './core/socket-io.adapter';

const logLevelRanks: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  debug: 4,
  verbose: 5,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'].slice(
      0,
      (logLevelRanks[config.logLevel ?? 'log'] ?? 2) + 1
    ) as LogLevel[],
  });
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tun-Judge API')
    .setDescription('Tun-Judge API Description')
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, document);

  app.use(
    SwaggerStats.getMiddleware({
      name: 'Tun-Judge',
      version: version,
      swaggerSpec: document,
      authentication: true,
      onAuthenticate: (req: any) => req.session.passport?.user.role.name === 'admin',
    })
  );

  await app.listen(config.nodeEnv === 'development' ? 3001 : 3000, '0.0.0.0');
}

bootstrap();
