import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Team } from '../models';
import http from '../utils/http-client';

export class TeamsStore {
  @observable data: Team[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Team[]> => {
    return (this.data = await http.get<Team[]>('api/teams'));
  };

  @action
  create = async (team: Partial<Team>): Promise<void> => {
    await http.post<Team>('api/teams', team);
    await this.fetchAll();
  };

  @action
  update = async (team: Partial<Team>): Promise<void> => {
    await http.put<Team>(`api/teams/${team.id}`, team);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/teams/${id}`);
    await this.fetchAll();
  };
}
