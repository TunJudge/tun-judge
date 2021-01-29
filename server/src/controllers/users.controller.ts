import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { User } from '../entities';
import { UsersService } from '../services';

@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Post()
  @Roles('admin')
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @Roles('admin')
  delete(
    @Param('id') id: string,
    @Session()
    {
      passport: {
        user: { id: currentId },
      },
    },
  ): Promise<void> {
    const _id = parseInt(id);
    if (_id === currentId) {
      throw new BadRequestException();
    }
    return this.usersService.delete(_id);
  }
}
