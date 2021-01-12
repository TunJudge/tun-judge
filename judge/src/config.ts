import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  hostname: process.env.TUN_JUDGE_HOSTNAME,
  username: process.env.TUN_JUDGE_USERNAME,
  password: process.env.TUN_JUDGE_PASSWORD,
};

export default config;
