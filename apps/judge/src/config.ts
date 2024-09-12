import { LogLevel } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

type Config = {
  hostname: string;
  url?: string;
  username?: string;
  password?: string;
  logLevel: LogLevel;
};

const config: Config = {
  hostname: process.env.HOSTNAME ?? 'localhost',
  url: process.env.TUN_JUDGE_URL,
  username: process.env.TUN_JUDGE_USERNAME,
  password: process.env.TUN_JUDGE_PASSWORD,
  logLevel: (process.env.LOG_LEVEL as LogLevel) ?? 'log',
};

export default config;
