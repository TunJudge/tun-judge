import { action, observable, runInAction } from 'mobx';
import { Problem } from '../models';
import http from '../utils/http-client';
import { BaseEntityStore } from './BaseEntityStore';
import { RootStore } from './RootStore';

export class ProblemsStore extends BaseEntityStore<Problem> {
  @observable item: Partial<Problem> = {};

  constructor(private readonly rootStore: RootStore) {
    super('problems');
  }

  @action
  cleanItem = (): void => {
    this.item = {};
  };

  fetchById = async (id: number): Promise<Problem> => {
    return runInAction(async () => (this.item = await http.get<Problem>(`api/problems/${id}`)));
  };

  rejudge = async (id: number): Promise<void> => {
    await http.patch(`api/problems/${id}/rejudge`);
  };
}
