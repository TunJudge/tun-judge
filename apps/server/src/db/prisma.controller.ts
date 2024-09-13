import { All, Body, Controller, Next, Post, Req, Res, Session } from '@nestjs/common';
import { enhance } from '@zenstackhq/runtime';
import makeHandler from '@zenstackhq/server/api/rpc';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { NextFunction, Request, Response } from 'express';
import SuperJSON from 'superjson';

import { PrismaClient } from '@prisma/client';

import { logPrismaOperation } from '../utils';
import { PrismaService } from './prisma.service';
import { PrismaEntity, PrismaOperation, PrismaQuery } from './types';

@Controller('api')
export class PrismaController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('transaction')
  async transaction(@Body() { meta, ...body }, @Session() { passport }) {
    const prisma = this.prisma.getEnhanced(passport?.user);
    const queries = meta?.serialization ? SuperJSON.deserialize({ json: body, meta }) : body;

    const res = await prisma.$transaction(async (tx) => {
      const results = [];
      const tx_ = enhance(tx, { user: passport?.user }, { logPrismaQuery: true });

      for (const { entity, operation, params } of Object.values(queries) as PrismaQuery[]) {
        results.push(await logPrismaOperation(tx_ as PrismaClient, entity, operation)(params));
      }

      return results;
    });

    const data = SuperJSON.serialize(res);

    return {
      data: data.json,
      ...(data.meta ?? { serialization: data.meta }),
    };
  }

  @All('rpc(/*)?')
  query(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
    @Session() { passport },
  ) {
    const prisma = this.prisma.getEnhanced(passport?.user);

    ZenStackMiddleware({
      handler: (options) =>
        makeHandler()({ ...options, path: options.path.replace('/api/rpc', '') }),
      getPrisma: () =>
        new Proxy({} as PrismaClient, {
          get: (_, entity: PrismaEntity) =>
            new Proxy(
              {},
              {
                get: (_, operation: PrismaOperation) =>
                  async function (params) {
                    return logPrismaOperation(prisma, entity, operation)(params);
                  },
              },
            ),
        }),
    })(request, response, next);
  }
}
