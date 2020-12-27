import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, LoginGuard } from '../core/guards';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LoginGuard)
  login(): boolean {
    return true;
  }

  @Get('logout')
  @UseGuards(AuthenticatedGuard)
  logout(@Req() req: Request, @Res() res: Response): void {
    req.session.destroy((err: Error) => err && console.log(err));
    res.clearCookie('connect.sid').end();
  }
}
