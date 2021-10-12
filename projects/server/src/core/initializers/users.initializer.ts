import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { User } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class UsersInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const users = await this.parseMetadataFile('users.json');
    for (const user of users) {
      user.password = await hash(
        user.password || Math.random().toString(36).substring(2),
        await genSalt(10)
      );
    }
    return entityManager.save(User, users);
  }
}
