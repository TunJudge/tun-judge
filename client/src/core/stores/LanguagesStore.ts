import { action, observable } from 'mobx';
import { Language } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export class LanguagesStore {
  @observable data: Language[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchAll = async (): Promise<Language[]> => {
    return (this.data = await http.get<Language[]>('api/languages'));
  };

  @action
  create = async (language: Partial<Language>): Promise<void> => {
    await http.post<Language>('api/languages', language);
    await this.fetchAll();
  };

  @action
  update = async (language: Partial<Language>): Promise<void> => {
    await http.put<Language>(`api/languages/${language.id}`, language);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/languages/${id}`);
    await this.fetchAll();
  };

  @action
  unzip = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.post(`api/languages/unzip`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await this.fetchAll();
  };
}
