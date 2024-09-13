import { Injectable } from '@nestjs/common';
import { enhance } from '@zenstackhq/runtime';

import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  getEnhanced(user?: User) {
    return enhance(this, { user }) as PrismaClient;
  }
}
