import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  database: {
    host: process.env.DATABASE_HOSTNAME,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  swaggerStats: {
    username: process.env.SWAGGER_STATS_USERNAME,
    password: process.env.SWAGGER_STATS_PASSWORD,
  },
};

export default config;
