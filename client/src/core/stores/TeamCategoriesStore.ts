import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { TeamCategory } from '../models';
import http from '../utils/http-client';

export class TeamCategoriesStore {
  @observable data: TeamCategory[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<TeamCategory[]> => {
    return (this.data = await http.get<TeamCategory[]>('api/team-categories'));
  };

  @action
  create = async (teamCategory: Partial<TeamCategory>): Promise<void> => {
    await http.post<TeamCategory>('api/team-categories', teamCategory);
    await this.fetchAll();
  };

  @action
  update = async (teamCategory: Partial<TeamCategory>): Promise<void> => {
    await http.put<TeamCategory>(`api/team-categories/${teamCategory.id}`, teamCategory);
    await this.fetchAll();
  };

  @action
  move = async (id: number, direction: 'up' | 'down'): Promise<void> => {
    await http.patch(`api/team-categories/${id}/${direction}`);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/team-categories/${id}`);
    await this.fetchAll();
  };
}
