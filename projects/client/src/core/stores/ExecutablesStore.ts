import { computed } from 'mobx';
import { Executable } from '../models';
import { BaseEntityStore } from './BaseEntityStore';
import { RootStore } from './RootStore';

export class ExecutablesStore extends BaseEntityStore<Executable> {
  @computed
  get runners(): Executable[] {
    return this.data.filter((e) => e.type === 'RUNNER');
  }

  @computed
  get checkers(): Executable[] {
    return this.data.filter((e) => e.type === 'CHECKER');
  }

  constructor(private readonly rootStore: RootStore) {
    super('executables');
  }
}
