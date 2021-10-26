import { computed } from 'mobx';

import { Executable } from '../models';
import { BaseEntityStore } from './BaseEntityStore';

export class ExecutablesStore extends BaseEntityStore<Executable> {
  constructor() {
    super('executables');
  }

  @computed
  get runners(): Executable[] {
    return this.data.filter((e) => e.type === 'RUNNER');
  }

  @computed
  get checkers(): Executable[] {
    return this.data.filter((e) => e.type === 'CHECKER');
  }
}
