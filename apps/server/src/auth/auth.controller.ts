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

    const prisma = new PrismaService();

    const user =
      (await prisma.user.findUnique({ where: { id: userId } })) ??
      throwError<User>(new NotFoundException());

    if (user.sessionId) store.destroy(user.sessionId);

    await prisma.user.update({
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
    const prisma = new PrismaService();

    await prisma.user.update({
      where: { id: (req.session as any).passport?.user?.id ?? -1 },
      data: { sessionId: null },
    });
    req.session.destroy(() => null);
    res.clearCookie('connect.sid').end();
  }
}
