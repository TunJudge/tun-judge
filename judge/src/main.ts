import config from './config';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { JudgeLogger } from './services/judge.logger';
import http from './http/http.client';

async function bootstrap() {
  const logger = new JudgeLogger();
  try {
    await http.post(`api/auth/login`, {
      username: config.username,
      password: config.password,
    });
    await http.post(`api/judge-hosts/subscribe`, {
      hostname: config.hostname,
      username: config.username,
    });
    logger.log('Successfully connected to TunJudge!');
  } catch (error) {
    const { statusCode, message } = error.response.data;
    new Logger().error(`${statusCode}: ${message}`);
    process.exit(-1);
  }
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(3001);
}
bootstrap();
