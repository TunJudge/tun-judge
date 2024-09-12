import { Module } from '@nestjs/common';

import { CustomRepositoryProvider } from '../../core/extended-repository';
import { Role, User } from '../../entities';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, RolesController],
  providers: [
    UsersService,
    RolesService,
    CustomRepositoryProvider(User),
    CustomRepositoryProvider(Role),
  ],
  exports: [UsersService, RolesService],
})
export class UsersModule {}
