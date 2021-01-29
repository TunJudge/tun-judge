import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { User } from '../entities';
import { UsersService } from '../services';

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
