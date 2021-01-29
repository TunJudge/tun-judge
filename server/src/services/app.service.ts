import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { ExtendedRepository } from '../core/extended-repository';
import { Role } from '../entities';
import { UsersService } from './users.service';

const roles: Partial<Role>[] = [
  {
    name: 'admin',
    description: 'System Administrator',
  },
  {
    name: 'jury',
    description: 'Jury Member',
  },
  {
    name: 'judge-host',
    description: 'Judge Host',
  },
  {
    name: 'team',
    description: 'Team Member',
  },
];

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Role)
    private readonly rolesRepository: ExtendedRepository<Role>,
  ) {
    this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    await this.rolesRepository.save(roles);
    if (!(await this.usersService.findByUsername('admin'))) {
      await this.usersService.save({
        name: 'Super Admin',
        username: 'admin',
        password: await hash('admin', await genSalt(10)),
        role: { name: 'admin' } as Role,
      });
    }
  }
}
