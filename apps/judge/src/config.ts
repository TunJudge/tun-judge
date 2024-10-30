import { LogLevel } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  workDir: process.env.SYSTEM_STORAGE_DIRECTORY_PATH ?? '/tmp/tun-judge',
  hostname: process.env.HOSTNAME ?? 'localhost',
  url: process.env.TUN_JUDGE_URL,
  username: process.env.TUN_JUDGE_USERNAME,
  password: process.env.TUN_JUDGE_PASSWORD,
  logLevel: (process.env.LOG_LEVEL as LogLevel) ?? 'log',
} as const;

export default config;
