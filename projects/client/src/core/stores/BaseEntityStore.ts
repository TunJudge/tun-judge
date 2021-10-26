import { observable, runInAction } from 'mobx';

import http from '../utils/http-client';

export class BaseEntityStore<T extends { id: number | string }> {
  @observable data: T[] = [];
  @observable updateCount: number = 0;

  constructor(private readonly route: string) {}

  fetchAll = async (): Promise<T[]> => {
    return runInAction(async () => (this.data = await http.get<T[]>(`api/${this.route}`)));
  };

  create = async (item: Partial<T>): Promise<void> => {
    await http.post<T>(`api/${this.route}`, item);
    runInAction(() => this.updateCount++);
  };

  update = async (item: Partial<T>): Promise<void> => {
    await http.put<T>(`api/${this.route}/${item.id}`, item);
    runInAction(() => this.updateCount++);
  };

  remove = async (id: number): Promise<void> => {
    await http.delete(`api/${this.route}/${id}`);
    runInAction(() => this.updateCount++);
  };
}
