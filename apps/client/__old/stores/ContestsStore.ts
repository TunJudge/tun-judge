import { action } from 'mobx';

import { Contest } from '../models';
import http from '../utils/http-client';
import { BaseEntityStore } from './BaseEntityStore';

export class ContestsStore extends BaseEntityStore<Contest> {
  constructor() {
    super('contests');
  }

  @action
  refreshScoreboardCache = async (id: number): Promise<void> => {
    await http.patch(`api/contests/${id}/refresh-scoreboard-cache`);
  };
}
