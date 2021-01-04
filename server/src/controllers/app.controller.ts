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
  async current(
    @Session()
    {
      passport: {
        user: { id },
      },
    },
  ): Promise<any> {
    const user = await this.usersRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    delete user.password;
    return user;
  }
}
