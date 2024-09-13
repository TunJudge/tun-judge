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

  error(message: any, trace?: string, context?: string): any {
    this.printMessage(message, clc.red, 'error', context || this.context, true, 'stderr');
    trace && process.stderr.write(`${trace}\n`);
  }

  warn(message: any, context?: string, returnToLine = true): any {
    this.printMessage(message, clc.yellow, 'warn', context || this.context, returnToLine);
  }

  log(message: any, context?: string, returnToLine = true): any {
    this.printMessage(message, clc.green, 'log', context || this.context, returnToLine);
  }

  debug(message: any, context?: string, returnToLine = true): any {
    this.printMessage(message, clc.magentaBright, 'debug', context || this.context, returnToLine);
  }

  verbose(message: any, context?: string, returnToLine = true): any {
    this.printMessage(message, clc.cyanBright, 'verbose', context || this.context, returnToLine);
  }

  printMessage(
    message: any,
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
