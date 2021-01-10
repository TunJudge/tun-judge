import { RootStore } from './RootStore';
import { action, observable } from 'mobx';
import { Contest, ContestProblem } from '../models';
import http from '../utils/http-client';

export class PublicStore {
  @observable problems: ContestProblem[] = [];
  @observable contests: Contest[] = [];
  @observable currentContest: Contest | undefined;

  constructor(private readonly rootStore: RootStore) {}

  @action
  fetchContests = async (): Promise<void> => {
    this.contests = await http.get<Contest[]>('api/public/contests');
    if (!this.contests.length) localStorage.removeItem('currentContestId');
    const currentContestId = localStorage.getItem('currentContestId') ?? '-1';
    this.currentContest = this.contests.find((c) => c.id === parseInt(currentContestId));
    if (!this.currentContest) this.setCurrentContest(this.contests[0]?.id);
  };

  @action
  fetchProblems = async (contestId: number): Promise<void> => {
    this.problems = await http.get<ContestProblem[]>(`api/public/contest/${contestId}/problems`);
  };

  @action
  setCurrentContest = (id: number): void => {
    this.currentContest = this.contests.find((c) => c.id === id);
    if (this.currentContest)
      localStorage.setItem('currentContestId', this.currentContest.id.toString());
  };
}
