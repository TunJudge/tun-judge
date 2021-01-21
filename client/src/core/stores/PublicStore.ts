import { RootStore } from './RootStore';
import { action, autorun, observable } from 'mobx';
import { Contest, ContestProblem, ScoreCache } from '../models';
import http from '../utils/http-client';

export class PublicStore {
  @observable problems: ContestProblem[] = [];
  @observable contests: Contest[] = [];
  @observable scoreCaches: ScoreCache[] = [];
  @observable currentContest: Contest | undefined;

  constructor(private readonly rootStore: RootStore) {
    autorun(
      async () => {
        if (this.currentContest && rootStore.updatesCount.scoreboard) {
          await this.fetchScoreCaches(this.currentContest.id);
        }
      },
      { delay: 10 },
    );
    autorun(
      async () => {
        if (rootStore.updatesCount.contests) {
          await this.fetchContests();
        }
      },
      { delay: 10 },
    );
    autorun(
      async () => {
        if (this.currentContest) {
          await this.fetchProblems(this.currentContest.id);
        }
      },
      { delay: 10 },
    );
  }

  @action
  fetchContests = async (): Promise<void> => {
    this.contests = await http.get<Contest[]>('api/public/contests');
    if (!this.contests.length) localStorage.removeItem('currentContestId');
    const currentContestId = parseInt(localStorage.getItem('currentContestId') ?? '-1');
    this.currentContest = this.contests.find((c) => c.id === currentContestId);
    if (!this.currentContest) this.setCurrentContest(this.contests[0]?.id);
  };

  @action
  fetchProblems = async (contestId: number): Promise<void> => {
    this.problems = await http.get<ContestProblem[]>(`api/public/contest/${contestId}/problems`);
  };

  @action
  fetchScoreCaches = async (contestId: number): Promise<void> => {
    this.scoreCaches = await http.get<ScoreCache[]>(`api/public/contest/${contestId}/score-caches`);
  };

  @action
  setCurrentContest = (id: number): void => {
    this.currentContest = this.contests.find((c) => c.id === id);
    if (this.currentContest)
      localStorage.setItem('currentContestId', this.currentContest.id.toString());
  };
}
