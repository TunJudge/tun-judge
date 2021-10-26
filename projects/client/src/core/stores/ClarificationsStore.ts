import { action, observable } from 'mobx';

import { Clarification } from '../models';
import http from '../utils/http-client';

export class ClarificationsStore {
  @observable data: Clarification[] = [];
  @observable item: Clarification = { general: true, messages: [] } as any;

  @action
  setItem = (item: Clarification): void => {
    this.item = item;
  };

  @action
  refreshItem = (): void => {
    this.item = this.data.find((item) => item.id === this.item.id) ?? this.item;
  };

  @action
  fetchAllForContest = async (contestId: number): Promise<Clarification[]> => {
    this.data = await http.get(`api/contests/${contestId}/clarifications`);
    this.refreshItem();
    return this.data;
  };

  @action
  fetchAllForTeam = async (contestId: number, teamId: number): Promise<Clarification[]> => {
    this.data = await http.get(`api/contests/${contestId}/team/${teamId}/clarifications`);
    this.refreshItem();
    return this.data;
  };

  @action
  sendClarification = async (
    contestId: number,
    clarification: Clarification
  ): Promise<Clarification> => {
    return (this.item = await http.post<Clarification>(
      `api/contests/${contestId}/clarifications`,
      clarification
    ));
  };

  @action
  setClarificationMessageAsSeen = async (
    contestId: number,
    clarificationId: number,
    messageId: number
  ): Promise<void> => {
    await http.patch<Clarification>(
      `api/contests/${contestId}/clarifications/${clarificationId}/message/${messageId}/set-as-seen`
    );
  };
}
