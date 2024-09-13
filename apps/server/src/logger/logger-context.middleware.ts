import { NextFunction, Request, Response } from 'express';

import { extractTraceId } from '../utils';
import { loggerStore } from './logger-store';

export function loggerContextMiddleware(req: Request, _: Response, next: NextFunction) {
  return loggerStore.run(
    {
      username: (req.session as any).passport?.user?.username,
      traceId: extractTraceId(req),
    },
    next,
  );
}
