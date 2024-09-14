import { Module } from '@nestjs/common';

import { PrismaController } from './prisma.controller';

@Module({
  controllers: [PrismaController],
})
export class DatabaseModule {}
