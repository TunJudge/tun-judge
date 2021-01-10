import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Submission } from '../models';
import http from '../utils/http-client';

export class TeamStore {
  @observable submissions: Submission[] = [];

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchSubmissions = async (contestId: number, teamId: number): Promise<void> => {
    this.submissions = await http.get<Submission[]>(
      `api/contests/${contestId}/team/${teamId}/submissions`,
    );
  };

  sendSubmission = async (
    contestId: number,
    teamId: number,
    submission: Submission,
  ): Promise<void> => {
    await http.post(`api/contests/${contestId}/team/${teamId}/submit`, submission);
  };
}
