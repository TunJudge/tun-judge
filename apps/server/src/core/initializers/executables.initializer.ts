import { Injectable } from '@nestjs/common';

import { Executable } from '../../entities';
import { AbstractInitializer } from './abstract-initializer';

@Injectable()
export class ExecutablesInitializer extends AbstractInitializer {
  async run(entityManager): Promise<void> {
    const executables = await this.parseFolder('executables');
    for (const executable of executables) {
      executable.sourceFile = await this.createFileEntity(executable.sourceFile, entityManager);
      if (executable.type === 'CHECKER') {
        executable.buildScript = await this.createFileEntity(executable.buildScript, entityManager);
      }
    }
    return entityManager.save(Executable, executables);
  }
}
