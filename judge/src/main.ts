import config from './config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import http from './http/http.client';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    await http.post(`api/auth/login`, {
      username: config.username,
      password: config.password,
    });
    new Logger().log('Successfully connected to TunJudge!');
  } catch (error) {
    const { statusCode, message } = error.response.data;
    new Logger().error(`${statusCode}: ${message}`);
    process.exit(-1);
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
