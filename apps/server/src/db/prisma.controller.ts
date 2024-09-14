import { All, Controller, Inject, Next, Req, Res } from '@nestjs/common';
import makeHandler from '@zenstackhq/server/api/rpc';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { NextFunction, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

import { logPrismaOperation } from '../utils';
import { PrismaService } from './prisma.service';
import { PrismaEntity, PrismaOperation } from './types';

@Controller('api')
export class PrismaController {
  constructor(@Inject(ENHANCED_PRISMA) private readonly prisma: PrismaService) {}

  @All('rpc(/*)?')
  query(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {
    const prisma = this.prisma;

    ZenStackMiddleware({
      handler: (options) =>
        makeHandler()({ ...options, path: options.path.replace('/api/rpc', '') }),
      getPrisma: () =>
        new Proxy({} as PrismaClient, {
          get: (_, entity: PrismaEntity) =>
            new Proxy({} as PrismaClient[PrismaEntity], {
              get: (_, operation: PrismaOperation) =>
                async function (params: unknown) {
                  return logPrismaOperation(prisma, entity, operation)(params);
                },
            }),
        }),
    })(request, response, next);
  }
}
