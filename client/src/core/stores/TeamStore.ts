import { RootStore } from './RootStore';
import { action, autorun, observable } from 'mobx';
import { Submission } from '../models';
import http from '../utils/http-client';

export class TeamStore {
  @observable submissions: Submission[] = [];

  constructor(private readonly rootStore: RootStore) {
    autorun(
      async () => {
        const {
          profile,
          updatesCount: { submissions },
          publicStore: { currentContest },
        } = rootStore;
        if (currentContest && profile?.team?.id && submissions) {
          await this.fetchSubmissions(currentContest.id, profile.team.id);
        }
      },
      { delay: 10 },
    );
  }

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
