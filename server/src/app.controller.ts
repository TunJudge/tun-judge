import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LogClass } from './core/log.decorator';
import { User } from './entities';
import { UsersService } from './features/users/users.service';
import { AuthenticatedGuard } from './guards';

@LogClass
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'Returns the logged in user' })
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
