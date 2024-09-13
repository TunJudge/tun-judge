import { AsyncLocalStorage } from 'async_hooks';

export type LoggerStore = {
  username?: string;
  traceId: string;
};

export const loggerStore = new AsyncLocalStorage<LoggerStore>();
