import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getAll(): Promise<User[]> {
    return this.usersRepository
      .find({
        order: { id: 'ASC' },
        relations: ['role', 'team'],
      })
      .then((users) => users.map((user) => user.clean()));
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() user: User): Promise<User> {
    user.password = await hash(
      user.password || Math.random().toString(36).substring(2),
      await genSalt(10),
    );
    return this.usersRepository.save(user);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() user: User): Promise<User> {
    const oldUser = await this.usersRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    if (user.password)
      user.password = await hash(user.password, await genSalt(10));
    return this.usersRepository.save({ ...oldUser, ...user });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(
    @Param('id') id: string,
    @Session()
    {
      passport: {
        user: { id: currentId },
      },
    },
  ): Promise<void> {
    if (parseInt(id) === currentId) {
      throw new BadRequestException();
    }
    await this.usersRepository.delete(id);
  }
}
