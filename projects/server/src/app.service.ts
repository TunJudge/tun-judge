import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { LogClass } from './core/log.decorator';
import { Role } from './entities';
import { RolesService } from './features/users/roles.service';
import { UsersService } from './features/users/users.service';

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

@LogClass
@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService
  ) {
    this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    await this.rolesService.save(roles);
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
