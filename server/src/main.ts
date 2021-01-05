import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import { RedisStore } from 'connect-redis';
import * as bodyParser from 'body-parser';

function getRedisStore(): RedisStore {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  });
  return new RedisStore({ client: redisClient });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: /.*/,
      credentials: true,
    });
  }
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(
    session({
      store: process.env.REDIS_HOST && getRedisStore(),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
