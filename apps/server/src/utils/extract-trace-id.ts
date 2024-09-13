import { Request } from 'express';

export function extractTraceId(req: Request) {
  const traceHeader = req.header('X-Cloud-Trace-Context');

  if (!traceHeader) {
    return Math.random().toString(36).substring(2);
  }

  const [trace] = traceHeader.split('/');

  return trace;
}
