import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Problem } from '../models';
import { request } from '../helpers';

export class ProblemsStore {
  @observable data: Problem[] = [];
  @observable item: Partial<Problem> = {};

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Problem[]> => {
    return (this.data = await request<Problem[]>('api/problems'));
  };

  @action
  fetchById = async (id: number): Promise<Problem> => {
    return (this.item = await request<Problem>(`api/problems/${id}`));
  };

  @action
  create = async (problem: Partial<Problem>): Promise<void> => {
    await request<Problem>('api/problems', 'POST', { data: problem });
    await this.fetchAll();
  };

  @action
  update = async (problem: Partial<Problem>): Promise<void> => {
    await request<Problem>(`api/problems/${problem.id}`, 'PUT', { data: problem });
    await this.fetchAll();
  };

  @action
  delete = async (id: number): Promise<void> => {
    await request<Problem>(`api/problems/${id}`, 'DELETE');
    await this.fetchAll();
  };
}
