import { ConsoleLogger, LogLevel, Logger } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';

import config from '../config';

const logLevelRanks: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  debug: 4,
  verbose: 5,
};

export class JudgeLogger extends ConsoleLogger {
  constructor(
    context: string,
    private onLog?: (log: string) => void,
  ) {
    super(context);
  }

  error(message: string, stack?: string, context?: string) {
    this.printMessage(message, clc.red, 'error', context || this.context, true, 'stderr');
    stack && process.stderr.write(`${stack}\n`);
  }

  warn(message: string, context?: string, returnToLine = true) {
    this.printMessage(message, clc.yellow, 'warn', context || this.context, returnToLine);
  }

  log(message: string, context?: string, returnToLine = true) {
    this.printMessage(message, clc.green, 'log', context || this.context, returnToLine);
  }

  debug(message: string, context?: string, returnToLine = true) {
    this.printMessage(message, clc.magentaBright, 'debug', context || this.context, returnToLine);
  }

  verbose(message: string, context?: string, returnToLine = true) {
    this.printMessage(message, clc.cyanBright, 'verbose', context || this.context, returnToLine);
  }

  printMessage(
    message: string,
    color: (message: string) => string,
    level: LogLevel,
    context = '',
    returnToLine = true,
    writeStreamType: 'stdout' | 'stderr' = 'stdout',
  ) {
    if (logLevelRanks[level] > (logLevelRanks[config.logLevel] ?? 2)) return;

    const output = color(message);
    const pidMessage = color(`[${level.toUpperCase()}]\t`);
    const contextMessage = context ? clc.yellow(`[${context}] `) : '';
    const computedMessage = `${pidMessage}${Logger.getTimestamp()}   ${contextMessage}${output}`;

    process[writeStreamType].write(computedMessage);
    returnToLine && process[writeStreamType].write('\n');

    this.onLog?.(computedMessage);
  }
}
