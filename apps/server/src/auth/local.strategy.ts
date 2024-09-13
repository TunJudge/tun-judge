import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '@prisma/client';

import { LogClass, LogParam } from '../logger';
import { AuthService } from './auth.service';

@LogClass
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    @LogParam('username') username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      return await this.authService.validateUser(username, password);
    } catch {
      throw new UnauthorizedException('The username and/or password you specified are not correct');
    }
  }
}
