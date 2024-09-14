import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';

import { User } from '@prisma/client';

import { AuthenticatedGuard } from './guards';
import { LogClass } from './logger';

@LogClass
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(private readonly cls: ClsService) {}

  @ApiOkResponse({ description: 'Returns the logged in user' })
  @Get('current')
  async current(): Promise<User> {
    return this.cls.get('auth');
  }
}
