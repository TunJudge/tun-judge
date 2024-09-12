import { action } from 'mobx';

import { Submission } from '../models';
import http from '../utils/http-client';

export class TeamStore {
  @action
  fetchSubmissions = async (contestId: number, teamId: number): Promise<Submission[]> => {
    return await http.get<Submission[]>(`api/contests/${contestId}/team/${teamId}/submissions`);
  };

  sendSubmission = async (
    contestId: number,
    teamId: number,
    submission: Submission
  ): Promise<void> => {
    await http.post(`api/contests/${contestId}/team/${teamId}/submit`, submission);
  };
}
