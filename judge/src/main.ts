import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import http from './http/http.client';
import { JudgeLogger } from './logger';

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
    const response = error?.response;
    if (response) {
      const { statusCode, message } = response.data;
      logger.error(`${statusCode}: ${message}`);
    } else {
      logger.error(error.message);
    }
    process.exit(-1);
  }
  const app = await NestFactory.create(AppModule, { logger });
  await app.listen(3001);
}

bootstrap();
