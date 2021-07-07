import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { LogClass } from '../core/log.decorator';
import { User } from '../entities';
import { UsersService } from '../services';

@LogClass
@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get('current')
  async current(
    @Session()
    {
      passport: {
        user: { id },
      },
    },
  ): Promise<User> {
    const user = await this.usersService.getById(id, ['team']);
    delete user.password;
    return user;
  }
}
