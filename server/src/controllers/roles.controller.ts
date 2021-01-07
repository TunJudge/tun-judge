import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Role } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('roles')
@UseGuards(AuthenticatedGuard)
export class RolesController {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: ExtendedRepository<Role>,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }
}
