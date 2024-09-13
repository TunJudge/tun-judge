import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { User } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { UsersService } from './users.service';

@LogClass
@ApiTags('Users')
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'List of all users', type: [User] })
  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @ApiCreatedResponse({ description: 'New User created', type: User })
  @Post()
  @Roles('admin')
  async create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @ApiOkResponse({ description: 'User updated', type: User })
  @Put(':id')
  @Roles('admin')
  update(@NumberParam('id') id: number, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }

  @ApiOkResponse({ description: 'User deleted' })
  @Delete(':id')
  @Roles('admin')
  delete(
    @NumberParam('id') id: number,
    @Session()
    {
      passport: {
        user: { id: currentId },
      },
    },
  ): Promise<void> {
    if (id === currentId) throw new BadRequestException();
    return this.usersService.delete(id);
  }
}
