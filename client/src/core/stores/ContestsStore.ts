import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Contest } from '../models';
import { request } from '../helpers';

export class ContestsStore {
  @observable data: Contest[] = [];
  @observable item: Partial<Contest> = { problems: [] };

  constructor(private readonly rootStore: RootStore) {}

  @action
  setItem = (contest: Partial<Contest>): void => {
    this.item = contest;
  };

  @action
  fetchAll = async (): Promise<Contest[]> => {
    return (this.data = await request<Contest[]>('api/contests'));
  };

  @action
  create = async (contest: Partial<Contest>): Promise<void> => {
    await request<Contest>('api/contests', 'POST', { data: contest });
    await this.fetchAll();
  };

  @action
  update = async (contest: Partial<Contest>): Promise<void> => {
    await request<Contest>(`api/contests/${contest.id}`, 'PUT', { data: contest });
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await request<Contest>(`api/contests/${id}`, 'DELETE');
    await this.fetchAll();
  };
}
