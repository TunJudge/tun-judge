import { action, observable } from 'mobx';
import { isEmpty } from '../helpers';
import { FileContent, Submission } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export type Filters = {
  contest: number;
  problems: number[];
  teams: number[];
  languages: number[];
  notJudged: boolean;
  notVerified: boolean;
};

export class SubmissionsStore {
  @observable data: Submission[] = [];
  @observable totalItems: number = 0;
  @observable currentPage: number = 0;
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
  setCurrentPage = (currentPage: number): void => {
    this.currentPage = currentPage;
  };

  @action
  fetchAll = async (): Promise<void> => {
    this.filters.contest = this.rootStore.publicStore.currentContest?.id ?? -1;
    [this.data, this.totalItems] = await http.get<[Submission[], number]>(
      `api/submissions?page=${this.currentPage}&${buildSearchQuery(this.filters)}`,
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
