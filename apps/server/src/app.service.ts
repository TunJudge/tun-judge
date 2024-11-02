import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { MainInitializer } from './initializers';
import { LogClass } from './logger';

@LogClass
@Injectable()
export class AppService {
  constructor(private readonly initializer: MainInitializer) {
    this.initializer._run(new PrismaClient());
  }
}
