import RedisStore from 'connect-redis';
import expressSession, { MemoryStore, Store } from 'express-session';
import { Redis } from 'ioredis';

import { config } from './config';

function buildStore(): Store {
  if (config.redisUrl) {
    return new RedisStore({ client: new Redis(config.redisUrl) });
  }
  return new MemoryStore();
}

export const store = buildStore();

export const session = expressSession({
  store: store,
  secret: config.sessionSecret ?? 'secret',
  resave: false,
  saveUninitialized: false,
});
