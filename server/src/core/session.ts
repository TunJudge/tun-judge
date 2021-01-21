import * as expressSession from 'express-session';
import { MemoryStore, Store } from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import config from './config';

function buildStore(): Store {
  if (config.redis.host) {
    const RedisStore = connectRedis(expressSession);
    return new RedisStore({
      client: redis.createClient(config.redis),
    });
  }
  return new MemoryStore();
}

export const store = buildStore();

const session = expressSession({
  store: store,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
});

export default session;
