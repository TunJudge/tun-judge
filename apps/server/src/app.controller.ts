import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { User } from '@prisma/client';

import { PrismaService } from './db';
import { AuthenticatedGuard } from './guards';
import { LogClass } from './logger';
import { cleanUser } from './utils';

@LogClass
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOkResponse({ description: 'Returns the logged in user' })
  @Get('current')
  async current(
    @Session()
    {
      passport: {
        user: { id },
      },
    },
  ): Promise<User> {
    return cleanUser(await this.prisma.user.findUnique({ where: { id }, include: { team: true } }));
  }
}
