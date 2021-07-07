import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { User } from '../entities';

@LogClass
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository
      .find({
        order: { id: 'ASC' },
        relations: ['role', 'team'],
      })
      .then((users) => users.map((user) => user.clean()));
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ id });
  }

  getById(id: number, relations: string[] = []): Promise<User> {
    return this.usersRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('User not found!'),
    );
  }

  getByUsername(username: string, relations: string[] = []): Promise<User> {
    return this.usersRepository.findOneOrThrow(
      { where: { username }, relations },
      new NotFoundException('User not found!'),
    );
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  async create(user: User): Promise<User> {
    user.password = await hash(
      user.password || Math.random().toString(36).substring(2),
      await genSalt(10),
    );
    return this.save(user);
  }

  save(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const oldUser = await this.getById(id);
    if (user.password) {
      user.password = await hash(user.password, await genSalt(10));
    }
    return this.save({ ...oldUser, ...user });
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
