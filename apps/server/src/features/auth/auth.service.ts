import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LogClass } from '../../core/log.decorator';
import { User } from '../../entities';
import { UsersService } from '../users/users.service';

@LogClass
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneOrThrow(
      { username, enabled: true },
      new UnauthorizedException('The username or password you entered is incorrect')
    );
    if (user.checkPassword(password)) {
      delete user.password;
      return user;
    }
    return null;
  }
}
