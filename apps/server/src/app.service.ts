import { Injectable } from '@nestjs/common';

import { PrismaService } from './db';
import { MainInitializer } from './initializers';
import { LogClass } from './logger';

@LogClass
@Injectable()
export class AppService {
  constructor(prisma: PrismaService, initializer: MainInitializer) {
    initializer._run(prisma);
  }
}
