import { computed } from 'mobx';

import { Language } from '../models';
import { BaseEntityStore } from './BaseEntityStore';

export class LanguagesStore extends BaseEntityStore<Language> {
  constructor() {
    super('languages');
  }

  @computed
  get allowedToSubmit(): Language[] {
    return this.data.filter((l) => l.allowSubmit);
  }
}
