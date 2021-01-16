import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { JudgeHost } from '../models';
import http from '../utils/http-client';

export class JudgeHostsStore {
  @observable data: JudgeHost[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<JudgeHost[]> => {
    return (this.data = await http.get<JudgeHost[]>('api/judge-hosts'));
  };

  @action
  toggle = async (id: number, active: boolean): Promise<void> => {
    await http.patch(`api/judge-hosts/${id}/toggle/${active}`);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/judge-hosts/${id}`);
    await this.fetchAll();
  };
}
