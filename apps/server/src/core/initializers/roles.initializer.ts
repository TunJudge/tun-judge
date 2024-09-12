import { Injectable } from '@nestjs/common';

import { Role } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class RolesInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const roles = await this.parseMetadataFile('roles.json');
    return entityManager.save(Role, roles);
  }
}
