import { Logger } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import socketService from './socket.service';

export class JudgeLogger extends Logger {
  log(message: any, context?: string, returnToLine = true): any {
    this.printMessage(
      message,
      clc.green,
      'INFO',
      context || this.context,
      returnToLine,
    );
  }

  warn(message: any, context?: string, returnToLine = true): any {
    this.printMessage(
      message,
      clc.yellow,
      'WARN',
      context || this.context,
      returnToLine,
    );
  }

  debug(message: any, context?: string, returnToLine = true): any {
    this.printMessage(
      message,
      clc.magentaBright,
      'DEBUG',
      context || this.context,
      returnToLine,
    );
  }

  verbose(message: any, context?: string, returnToLine = true): any {
    this.printMessage(
      message,
      clc.cyanBright,
      'VERBOSE',
      context || this.context,
      returnToLine,
    );
  }

  error(message: any, trace?: string, context?: string): any {
    this.printMessage(
      message,
      clc.red,
      'ERROR',
      context || this.context,
      true,
      'stderr',
    );
    trace && process.stderr.write(`${trace}\n`);
  }

  printMessage(
    message: any,
    color: (message: string) => string,
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'VERBOSE',
    context = '',
    returnToLine = true,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    const output = color(message);
    const pidMessage = color(`[${level}]\t`);
    const contextMessage = context ? clc.yellow(`[${context}] `) : '';
    const computedMessage = `${pidMessage}${this.getTimestamp()}   ${contextMessage}${output}`;

    process[writeStreamType ?? 'stdout'].write(computedMessage);
    returnToLine && process[writeStreamType ?? 'stdout'].write('\n');
    socketService.connected && socketService.emitLogLine(computedMessage);
  }
}
