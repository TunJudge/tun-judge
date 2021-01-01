import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Language } from '../models';
import { request } from '../helpers';

export class LanguagesStore {
  @observable data: Language[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Language[]> => {
    return (this.data = await request<Language[]>('api/languages'));
  };

  @action
  create = async (language: Partial<Language>): Promise<void> => {
    await request<Language>('api/languages', 'POST', { data: language });
    await this.fetchAll();
  };

  @action
  update = async (language: Partial<Language>): Promise<void> => {
    await request<Language>(`api/languages/${language.id}`, 'PUT', { data: language });
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await request<Language>(`api/languages/${id}`, 'DELETE');
    await this.fetchAll();
  };
}
