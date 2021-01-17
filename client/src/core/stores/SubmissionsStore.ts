import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Submission } from '../models';
import http from '../utils/http-client';

export class SubmissionsStore {
  @observable data: Submission[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Submission[]> => {
    return (this.data = await http.get<Submission[]>('api/submissions'));
  };
}
