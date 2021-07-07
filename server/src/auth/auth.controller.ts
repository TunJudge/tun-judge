import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard, LoginGuard } from '../core/guards';
import { LogClass } from '../core/log.decorator';
import { User } from '../entities';

@LogClass
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  login(): boolean {
    return true;
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.usersRepository.update(
      { id: (req.session as any).passport.user.id },
      { sessionId: null },
    );
    req.session.destroy(() => null);
    res.clearCookie('connect.sid').end();
  }
}
