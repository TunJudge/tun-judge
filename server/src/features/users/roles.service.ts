import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { Role } from '../../entities';

@LogClass
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: ExtendedRepository<Role>,
  ) {}

  getAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  save(roles: Partial<Role>[]): Promise<Role[]> {
    return this.rolesRepository.save(roles);
  }
}
