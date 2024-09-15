import { action, autorun, computed, observable, reaction } from 'mobx';

import { Contest, ContestProblem, ScoreCache } from '../models';
import http from '../utils/http-client';
import { RootStore } from './RootStore';

export class PublicStore {
  @observable problems: ContestProblem[] = [];
  @observable contests: Contest[] = [];
  @observable scoreCaches: ScoreCache[] = [];
  @observable currentContest: Contest | undefined;

  constructor(private readonly rootStore: RootStore) {
    autorun(() => rootStore.updatesCount.contests && this.fetchContests());
    reaction(
      () => [this.currentContest, rootStore.updatesCount.scoreboard],
      () => this.currentContest && this.fetchScoreCaches(this.currentContest.id),
    );
    reaction(
      () => [this.currentContest, rootStore.connected],
      () => this.currentContest && this.fetchProblems(this.currentContest.id),
    );
    reaction(
      () => rootStore.connected,
      () => this.currentContest && this.fetchScoreCaches(this.currentContest.id),
    );
  }

  @action
  fetchContests = async (): Promise<void> => {
    this.contests = await http.get<Contest[]>('api/public/contests');
    if (!this.contests.length) {
      delete this.rootStore.appLocalCache.currentContestId;
      return;
    }
    const currentContestId = this.rootStore.appLocalCache.currentContestId ?? -1;
    this.currentContest = this.contests.find((c) => c.id === currentContestId);
    if (!this.currentContest) this.setCurrentContest(this.contests[0]?.id);
  };

  @action
  fetchProblems = async (contestId: number): Promise<ContestProblem[]> => {
    return (this.problems = await http.get<ContestProblem[]>(
      `api/public/contest/${contestId}/problems`,
    ));
  };

  @action
  fetchScoreCaches = async (contestId: number): Promise<void> => {
    this.scoreCaches = await http.get<ScoreCache[]>(`api/public/contest/${contestId}/score-caches`);
  };

  @action
  setCurrentContest = (id: number): void => {
    this.currentContest = this.contests.find((c) => c.id === id);
    if (this.currentContest) {
      this.rootStore.appLocalCache.currentContestId = this.currentContest.id;
    }
  };

  @computed
  get totalSubmissions(): number {
    return this.scoreCaches.reduce<number>(
      (acc, scoreCache) => acc + scoreCache.restrictedSubmissions + scoreCache.restrictedPending,
      0,
    );
  }

  @computed
  get totalPendingSubmissions(): number {
    return this.scoreCaches
      .filter((scoreCache) => scoreCache.restrictedPending)
      .reduce<number>((acc, scoreCache) => acc + scoreCache.restrictedPending, 0);
  }

  @computed
  get totalWrongSubmissions(): number {
    return this.totalSubmissions - this.totalPendingSubmissions - this.totalCorrectSubmissions;
  }

  @computed
  get totalCorrectSubmissions(): number {
    return this.scoreCaches.filter((scoreCache) => scoreCache.restrictedCorrect).length;
  }

  @computed
  get isCurrentContestActive(): boolean {
    return (
      !!this.currentContest && Date.now() >= new Date(this.currentContest.activateTime).getTime()
    );
  }

  @computed
  get isCurrentContestStarted(): boolean {
    return !!this.currentContest && Date.now() >= new Date(this.currentContest.startTime).getTime();
  }

  @computed
  get isCurrentContestFrozen(): boolean {
    return (
      !!this.currentContest &&
      Date.now() >=
        new Date(this.currentContest.freezeTime ?? this.currentContest.endTime).getTime()
    );
  }

  @computed
  get isCurrentContestOver(): boolean {
    return !!this.currentContest && Date.now() >= new Date(this.currentContest.endTime).getTime();
  }

  @computed
  get isCurrentContestUnfrozen(): boolean {
    return (
      !!this.currentContest &&
      Date.now() >=
        new Date(this.currentContest.unfreezeTime ?? this.currentContest.endTime).getTime()
    );
  }
}
