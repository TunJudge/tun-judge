import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { LogClass } from '../../core/log.decorator';
import { AuthenticatedGuard, LoginGuard } from '../../guards';
import { UsersService } from '../users/users.service';

@LogClass
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ description: 'Logged in successfully' })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials' })
  @Post('login')
  @UseGuards(LoginGuard)
  login(): boolean {
    return true;
  }

  @ApiOkResponse({ description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.usersService.update((req.session as any).passport.user.id, { sessionId: null });
    req.session.destroy(() => null);
    res.clearCookie('connect.sid').end();
  }
}
