import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { AppModule } from './app.module';
import { config } from './config';
import { logger, loggerContextMiddleware } from './logger';
import { session } from './session';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  if (config.nodeEnv === 'development') {
    app.enableCors({
      origin: /.*/,
      credentials: true,
    });
  }
  app.setGlobalPrefix('api');
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  app.use(session);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(loggerContextMiddleware);

  // const swaggerConfig = new DocumentBuilder()
  //   .setTitle('Tun-Judge API')
  //   .setDescription('Tun-Judge API Description')
  //   .setVersion(version)
  //   .build();
  // const document = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup('api/swagger', app, document);

  // app.use(
  //   SwaggerStats.getMiddleware({
  //     name: 'Tun-Judge',
  //     version: version,
  //     swaggerSpec: document,
  //     authentication: true,
  //     onAuthenticate: (req: any) => req.session.passport?.user.role.name === 'admin',
  //   }),
  // );

  await app.listen(config.port, '0.0.0.0');
  logger.log(
    `Server started listing on ports ${config.port} with env ${config.nodeEnv}`,
    'NestApplication',
  );
}

bootstrap();
