import { Executable } from '../models';
import { BaseEntityStore } from './BaseEntityStore';
import { RootStore } from './RootStore';

export class ExecutablesStore extends BaseEntityStore<Executable> {
  constructor(private readonly rootStore: RootStore) {
    super('executables');
  }
}
