import { DynamicModule } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

import { PrismaController } from './prisma.controller';
import { PrismaService } from './prisma.service';

export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      controllers: [PrismaController],
      providers: [
        {
          provide: PrismaService,
          useClass: PrismaClient,
        },
      ],
      exports: [PrismaService],
    };
  }
}
