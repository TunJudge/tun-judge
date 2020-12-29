import {
  Controller,
  Get,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  @Get('current')
  async ping(
    @Session()
    {
      passport: {
        user: { id },
      },
    },
  ): Promise<any> {
    return this.usersRepository
      .findOneOrThrow(id, { relations: ['roles'] }, new NotFoundException())
      .then((user) => {
        delete user.password;
        return {
          ...user,
          roles: user.roles.map((r) => r.role),
        };
      });
  }
}
