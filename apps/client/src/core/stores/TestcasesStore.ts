import { action, autorun, observable } from 'mobx';

import { ProblemsStore } from '@core/stores/ProblemsStore';

import { FileContent, Testcase } from '../models';
import http from '../utils/http-client';

export class TestcasesStore {
  @observable data: Testcase[] = [];
  problemId: number | undefined;

  constructor(private readonly problemsStore: ProblemsStore) {
    autorun(
      () => {
        this.problemId = problemsStore.item.id;
        this.problemId && this.fetchAll();
        !this.problemId && (this.data = []);
      },
      { delay: 10 },
    );
  }

  @action
  fetchAll = async (): Promise<void> => {
    this.data = await http.get<Testcase[]>(`api/testcases/problem/${this.problemId}`);
  };

  @action
  create = async (testcase: Partial<Testcase>): Promise<void> => {
    await http.post<Testcase>(`api/testcases/problem/${this.problemId}`, testcase);
    await this.fetchAll();
  };

  @action
  update = async (testcase: Partial<Testcase>): Promise<void> => {
    await http.put<Testcase>(`api/testcases/${testcase.id}`, testcase);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/testcases/${id}`);
    await this.fetchAll();
  };

  @action
  move = async (id: number, direction: 'up' | 'down'): Promise<void> => {
    await http.patch(`api/testcases/${id}/${direction}`);
    await this.fetchAll();
  };

  fetchContent = (id: number, file: 'input' | 'output'): Promise<FileContent> => {
    return http.get<FileContent>(`api/testcases/${id}/content/${file}`);
  };
}
