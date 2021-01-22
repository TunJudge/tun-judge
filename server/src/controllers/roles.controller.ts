import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Role } from '../entities';

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
