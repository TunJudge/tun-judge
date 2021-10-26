import { runInAction } from 'mobx';

import { TeamCategory } from '../models';
import http from '../utils/http-client';
import { BaseEntityStore } from './BaseEntityStore';

export class TeamCategoriesStore extends BaseEntityStore<TeamCategory> {
  constructor() {
    super('team-categories');
  }

  move = async (id: number, direction: 'up' | 'down'): Promise<void> => {
    await http.patch(`api/team-categories/${id}/${direction}`);
    runInAction(() => this.updateCount++);
  };
}
