import * as session from 'express-session';
import { MemoryStore, Store } from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import config from './config';

function buildStore(): Store {
  if (config.redis.host) {
    const RedisStore = connectRedis(session);
    return new RedisStore({
      client: redis.createClient(config.redis),
    });
  }
  return new MemoryStore();
}

const store = buildStore();

export default store;
