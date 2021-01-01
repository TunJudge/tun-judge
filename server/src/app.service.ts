import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities';
import { ExtendedRepository } from './core/extended-repository';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: ExtendedRepository<Role>,
  ) {
    this.initDatabase();
    this.initTeam();
  }

  async initDatabase(): Promise<void> {
    let role = await this.rolesRepository.findOne({ name: 'admin' });
    if (!role) {
      role = await this.rolesRepository.save({
        name: 'admin',
        description: 'System Administrator',
      });
    }
    if (!(await this.usersRepository.findOne({ username: 'admin' }))) {
      await this.usersRepository.save({
        name: 'Super Admin',
        username: 'admin',
        password: await hash('admin', await genSalt(10)),
        role: role,
      });
    }
  }

  async initTeam(): Promise<void> {
    let role = await this.rolesRepository.findOne({ name: 'team' });
    if (!role) {
      role = await this.rolesRepository.save({
        name: 'team',
        description: 'Team',
      });
    }
    if (!(await this.usersRepository.findOne({ username: 'team' }))) {
      await this.usersRepository.save({
        name: 'Team',
        username: 'team',
        password: await hash('team', await genSalt(10)),
        role: role,
      });
    }
  }
}
