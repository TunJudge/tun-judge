import { action, observable } from 'mobx';
import http from '../utils/http-client';

export class BaseEntityStore<T extends { id: number | string }> {
  @observable data: T[] = [];

  constructor(private readonly route: string) {}

  @action
  fetchAll = async (): Promise<T[]> => {
    return (this.data = await http.get<T[]>(`api/${this.route}`));
  };

  @action
  create = async (item: Partial<T>): Promise<void> => {
    await http.post<T>(`api/${this.route}`, item);
    await this.fetchAll();
  };

  @action
  update = async (item: Partial<T>): Promise<void> => {
    await http.put<T>(`api/${this.route}/${item.id}`, item);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/${this.route}/${id}`);
    await this.fetchAll();
  };

  @action
  unzip = async (file: File, multiple = false): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.post(`api/${this.route}/unzip`, formData, {
      params: { multiple },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await this.fetchAll();
  };
}
