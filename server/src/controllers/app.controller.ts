import {
  Controller,
  Get,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { User } from '../entities';

@Controller()
@UseGuards(AuthenticatedGuard)
export class AppController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  @Get('current')
  async current(
    @Session()
    {
      passport: {
        user: { id },
      },
    },
  ): Promise<User> {
    const user = await this.usersRepository.findOneOrThrow(
      id,
      { relations: ['team'] },
      new NotFoundException(),
    );
    delete user.password;
    return user;
  }
}
