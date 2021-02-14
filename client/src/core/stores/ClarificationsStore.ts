import { action, observable } from 'mobx';
import { Clarification } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export class ClarificationsStore {
  @observable data: Clarification[] = [];
  @observable item: Clarification = { messages: [] } as any;

  constructor(private readonly rootStore: RootStore) {}

  @action
  setItem = (item: Clarification): void => {
    this.item = item;
  };

  @action
  fetchAllForTeam = async (contestId: number, teamId: number): Promise<Clarification[]> => {
    return (this.data = await http.get(`api/contests/${contestId}/team/${teamId}/clarifications`));
  };

  @action
  sendClarification = async (
    contestId: number,
    clarification: Clarification,
  ): Promise<Clarification> => {
    return (this.item = await http.post<Clarification>(
      `api/contests/${contestId}/clarifications`,
      clarification,
    ));
  };
}
