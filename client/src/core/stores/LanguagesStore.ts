import { computed } from 'mobx';
import { Language } from '../models';
import { BaseEntityStore } from './BaseEntityStore';
import { RootStore } from './RootStore';

export class LanguagesStore extends BaseEntityStore<Language> {
  constructor(private readonly rootStore: RootStore) {
    super('languages');
  }

  @computed
  get allowedToSubmit(): Language[] {
    return this.data.filter((l) => l.allowSubmit);
  }
}
