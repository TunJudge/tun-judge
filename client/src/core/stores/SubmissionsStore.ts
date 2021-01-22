import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { FileContent, Submission } from '../models';
import http from '../utils/http-client';
import { isEmpty } from '../helpers';

export type Filters = {
  problems: number[];
  teams: number[];
  languages: number[];
  notJudged: boolean;
  notVerified: boolean;
};

export class SubmissionsStore {
  @observable data: Submission[] = [];
  @observable total: number = 0;
  @observable page: number = 0;
  @observable item: Submission | undefined;
  @observable filters: Partial<Filters> = {};

  constructor(private readonly rootStore: RootStore) {}

  @action
  cleanItem = (): void => {
    this.item = undefined;
  };

  @action
  setFilters = (filters: Partial<Filters>): void => {
    this.filters = filters;
  };

  @action
  setPage = (page: number): void => {
    this.page = page;
  };

  @action
  fetchAll = async (): Promise<void> => {
    [this.data, this.total] = await http.get<[Submission[], number]>(
      `api/submissions?page=${this.page}&${buildSearchQuery(this.filters as any)}`,
    );
  };

  fetchById = async (id: number): Promise<Submission> => {
    return (this.item = await http.get<Submission>(`api/submissions/${id}`));
  };

  claim = async (id: number): Promise<void> => {
    await http.patch(`api/submissions/${id}/claim`);
  };

  unClaim = async (id: number): Promise<void> => {
    await http.patch(`api/submissions/${id}/un-claim`);
  };

  rejudge = async (id: number): Promise<void> => {
    await http.patch(`api/submissions/${id}/rejudge`);
  };

  ignore = async (id: number): Promise<void> => {
    await http.patch(`api/submissions/${id}/ignore`);
  };

  unIgnore = async (id: number): Promise<void> => {
    await http.patch(`api/submissions/${id}/un-ignore`);
  };

  markVerified = async (id: number): Promise<void> => {
    await http.patch(`api/submissions/${id}/mark-verified`);
  };

  fetchRunContent = (id: number): Promise<FileContent> => {
    return http.get<FileContent>(`api/submissions/${this.item?.id}/run/${id}/content`);
  };
}

function buildSearchQuery(
  filters: Record<string, string | boolean | number | string[] | boolean[] | number[]>,
): string {
  return Object.entries(filters)
    .filter(([, value]) => !isEmpty(value))
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
    .join('&');
}
