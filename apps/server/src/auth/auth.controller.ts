import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { User } from '@prisma/client';

import { config } from '../config';
import { PrismaService } from '../db';
import { AuthenticatedGuard, LoginGuard } from '../guards';
import { store } from '../session';
import { throwError } from '../utils';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('login')
  @UseGuards(LoginGuard)
  async login(
    @Req() req: Request,
    @Session()
    {
      passport: {
        user: { id: userId },
      },
    },
  ) {
    if (config.nodeEnv === 'development') return;

    const user =
      (await this.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      })) ?? throwError<User>(new NotFoundException());

    if (user.sessionId) store.destroy(user.sessionId);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        lastIpAddress: (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as
          | string
          | undefined,
        sessionId: req.sessionID,
      },
    });
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.prisma.user.update({
      where: { id: (req.session as any).passport?.user?.id ?? -1 },
      data: { sessionId: null },
    });
    req.session.destroy(() => null);
    res.clearCookie('connect.sid').end();
  }
}
