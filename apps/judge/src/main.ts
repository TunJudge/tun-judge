import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './config';
import { fixError } from './helpers';
import http from './http/http.client';
import { JudgeLogger } from './logger';

async function bootstrap() {
  const logger = new JudgeLogger('main');
  try {
    console.log('Connecting to TunJudge...', config);

    await http.post(`api/auth/login`, {
      username: config.username,
      password: config.password,
    });

    logger.log('Successfully connected to TunJudge!');
  } catch (error: unknown) {
    const newError = fixError(error);
    logger.error(newError.message, newError.stack);
    process.exit(-1);
  }
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(3002);
}

bootstrap();
