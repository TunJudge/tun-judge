import { Logger } from '@nestjs/common';

const loggers = new Map<string, Logger>();

export class LoggerFactory {
  static getInstance(context: string): Logger {
    if (!loggers.has(context)) {
      loggers.set(context, new Logger(context));
    }

    return loggers.get(context);
  }
}
