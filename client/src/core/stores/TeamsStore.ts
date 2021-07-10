import { observable } from 'mobx';
import { Team } from '../models';
import { BaseEntityStore } from './BaseEntityStore';
import { RootStore } from './RootStore';

export class TeamsStore extends BaseEntityStore<Team> {
  @observable data: Team[] = [];

  constructor(private readonly rootStore: RootStore) {
    super('teams');
  }
}
