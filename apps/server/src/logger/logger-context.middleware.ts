import { NextFunction, Request, Response } from 'express';

import { Session } from '../types';
import { extractTraceId } from '../utils';
import { loggerStore } from './logger-store';

export function loggerContextMiddleware(req: Request, _: Response, next: NextFunction) {
  return loggerStore.run(
    {
      username: (req.session as unknown as Session).passport?.user?.username,
      traceId: extractTraceId(req),
    },
    next,
  );
}
