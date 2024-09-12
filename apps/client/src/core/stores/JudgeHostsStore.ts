import { action, observable, runInAction } from 'mobx';

import { JudgeHost } from '../models';
import http from '../utils/http-client';

export class JudgeHostsStore {
  @observable data: JudgeHost[] = [];
  @observable updateCount: number = 0;

  @action
  fetchAll = async (): Promise<JudgeHost[]> => {
    return (this.data = await http.get<JudgeHost[]>('api/judge-hosts'));
  };

  @action
  toggle = async (id: number, active: boolean): Promise<void> => {
    await http.patch(`api/judge-hosts/${id}/toggle/${active}`);
    runInAction(() => this.updateCount++);
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/judge-hosts/${id}`);
    runInAction(() => this.updateCount++);
  };
}
