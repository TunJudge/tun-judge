import { RootStore } from './RootStore';
import { action, autorun, observable } from 'mobx';
import { FileContent, Testcase } from '../models';
import { request } from '../helpers';

export class TestcasesStore {
  @observable data: Testcase[] = [];
  problemId: number | undefined;

  constructor(private readonly rootStore: RootStore) {
    autorun(() => {
      this.problemId = rootStore.problemsStore.item.id;
      this.problemId && this.fetchAll();
      !this.problemId && (this.data = []);
    });
  }

  @action
  fetchAll = async (): Promise<void> => {
    this.data = await request<Testcase[]>(`api/testcases/problem/${this.problemId}`);
  };

  @action
  create = async (testcase: Partial<Testcase>): Promise<void> => {
    await request<Testcase>(`api/testcases/problem/${this.problemId}`, 'POST', {
      data: testcase,
    });
    await this.fetchAll();
  };

  @action
  update = async (testcase: Partial<Testcase>): Promise<void> => {
    await request<Testcase>(`api/testcases/${testcase.id}`, 'PUT', { data: testcase });
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await request<Testcase>(`api/testcases/${id}`, 'DELETE');
    await this.fetchAll();
  };

  @action
  move = async (id: number, direction: 'up' | 'down'): Promise<void> => {
    await request<Testcase>(`api/testcases/${id}/${direction}`, 'PATCH');
    await this.fetchAll();
  };

  fetchContent = (id: number, file: 'input' | 'output'): Promise<FileContent> => {
    return request<FileContent>(`api/testcases/${id}/content/${file}`);
  };
}
