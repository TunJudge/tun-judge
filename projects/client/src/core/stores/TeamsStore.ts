import { observable } from 'mobx';

import { Team } from '../models';
import { BaseEntityStore } from './BaseEntityStore';

export class TeamsStore extends BaseEntityStore<Team> {
  @observable data: Team[] = [];

  constructor() {
    super('teams');
  }
}
