import { PrismaClient } from '@prisma/client';

import type { PrismaEntity, PrismaOperation } from '../db';
import { logger, loggerStore } from '../logger';
import { getDuration } from './get-duration';

export function logPrismaOperation(
  prisma: PrismaClient,
  entity: PrismaEntity,
  operation: PrismaOperation,
) {
  return (params: unknown) => {
    const time = performance.now();
    const methodName = `${entity}.${operation}`;

    const onSuccess = (time: number) => (result: unknown) => {
      const duration = getDuration(time);
      logger.debug?.(
        {
          message: `[OUT] ${String(methodName)}() - ${duration} ms`,
          methodName,
          duration: `${duration} ms`,
          params,
          ...loggerStore.getStore(),
        },
        'PrismaService',
      );

      return result;
    };

    const onError = (time: number) => (error?: Error) => {
      const duration = getDuration(time);
      logger.error(
        {
          message: `[OUT] ${String(methodName)}() (${error?.message ?? '-'}) - ${duration} ms`,
          methodName,
          duration: `${duration} ms`,
          params,
          ...loggerStore.getStore(),
        },
        error?.stack,
        'PrismaService',
      );

      throw error;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (prisma[entity][operation] as any)(params).then(onSuccess(time)).catch(onError(time));
  };
}
