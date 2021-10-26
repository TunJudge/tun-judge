import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { Role } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { RolesService } from './roles.service';

@LogClass
@ApiTags('User Roles')
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('roles')
@UseGuards(AuthenticatedGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({ description: 'List of user roles', type: [Role] })
  @Get()
  @Roles('admin')
  getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }
}
