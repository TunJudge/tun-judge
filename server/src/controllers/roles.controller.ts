import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Role } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../core/roles.decorator';

@Controller('roles')
@UseGuards(AuthenticatedGuard)
export class RolesController {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: ExtendedRepository<Role>,
  ) {}

  @Get()
  @Roles('admin')
  getAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
