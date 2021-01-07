import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities';
import { ExtendedRepository } from './core/extended-repository';
import { genSalt, hash } from 'bcrypt';

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
    name: 'team',
    description: 'Team Member',
  },
];

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: ExtendedRepository<Role>,
  ) {
    this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    await this.rolesRepository.save(roles);
    if (!(await this.usersRepository.findOne({ username: 'admin' }))) {
      await this.usersRepository.save({
        name: 'Super Admin',
        username: 'admin',
        password: await hash('admin', await genSalt(10)),
        role: { name: 'admin' },
      });
    }
  }
}
