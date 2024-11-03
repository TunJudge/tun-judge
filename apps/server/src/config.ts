import * as dotenv from 'dotenv';

import { version } from '../../../package.json';

dotenv.config();

export const config = {
  project: 'tun-judge-server',
  version: version,
  port: process.env['PORT'] ?? 3000,
  nodeEnv: process.env['ENVIRONMENT'] ?? 'development',
  logging: {
    level: process.env['LOG_LEVEL'],
    transport: process.env['LOG_TRANSPORT'],
  },
  sessionSecret: process.env['SESSION_SECRET'],
  redisUrl: process.env['REDIS_URL'],
  filesStorage: {
    system: {
      directoryPath: process.env['SYSTEM_STORAGE_DIRECTORY_PATH'],
    },
    google: {
      enabled: process.env['GOOGLE_STORAGE_ENABLED'] === 'true',
      googleProjectId: process.env['GOOGLE_STORAGE_PROJECT_ID'],
      bucketName: process.env['GOOGLE_STORAGE_BUCKET_NAME'] ?? '',
    },
  },
};
