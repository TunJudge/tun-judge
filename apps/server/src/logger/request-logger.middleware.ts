import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { getDuration } from '../utils';
import { logger } from './logger';
import { loggerStore } from './logger-store';

const BLACKLIST: ['startsWith' | 'endsWith', string[]][] = [['startsWith', ['/assets']]];

export class RequestLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl } = request;
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const userAgent = request.get('user-agent') || '';
    const time = performance.now();

    if (!BLACKLIST.some(([fn, urls]) => urls.some((url) => originalUrl[fn]?.(url)))) {
      response.on('finish', () => {
        const isError = response.statusCode >= 400;
        const latency = getDuration(time);

        logger.log(
          {
            message: `[${method.toUpperCase()}] ${originalUrl} ${
              response.statusCode
            } - ${userAgent} (${ip}) - ${latency} ms`,
            level: isError ? 'warn' : 'info',
            statusCode: response.statusCode,
            latency: `${latency} ms`,
            ip,
            body: request.body,
            ...loggerStore.getStore(),
          },
          'RequestLoggerMiddleware',
        );
      });
    }

    next();
  }
}
