import { action, observable } from 'mobx';
import { Problem } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export class ProblemsStore {
  @observable data: Problem[] = [];
  @observable item: Partial<Problem> = {};

  constructor(private readonly rootStore: RootStore) {}

  @action
  cleanItem = (): void => {
    this.item = {};
  };

  @action
  fetchAll = async (): Promise<Problem[]> => {
    return (this.data = await http.get<Problem[]>('api/problems'));
  };

  @action
  fetchById = async (id: number): Promise<Problem> => {
    return (this.item = await http.get<Problem>(`api/problems/${id}`));
  };

  @action
  create = async (problem: Partial<Problem>): Promise<void> => {
    await http.post<Problem>('api/problems', problem);
    await this.fetchAll();
  };

  @action
  update = async (problem: Partial<Problem>): Promise<void> => {
    await http.put<Problem>(`api/problems/${problem.id}`, problem);
    await this.fetchAll();
  };

  @action
  rejudge = async (id: number): Promise<void> => {
    await http.patch(`api/problems/${id}/rejudge`);
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/problems/${id}`);
    await this.fetchAll();
  };

  @action
  unzip = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.post(`api/problems/unzip`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await this.fetchAll();
  };
}
