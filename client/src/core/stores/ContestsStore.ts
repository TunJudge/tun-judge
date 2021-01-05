import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Contest } from '../models';
import http from '../utils/http-client';

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
    return (this.data = await http.get<Contest[]>('api/contests'));
  };

  @action
  create = async (contest: Partial<Contest>): Promise<void> => {
    await http.post<Contest>('api/contests', contest);
    await this.fetchAll();
  };

  @action
  update = async (contest: Partial<Contest>): Promise<void> => {
    await http.put<Contest>(`api/contests/${contest.id}`, contest);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/contests/${id}`);
    await this.fetchAll();
  };
}
