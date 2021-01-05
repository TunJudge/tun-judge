import { action, autorun, observable } from 'mobx';
import { User } from '../models';
import { ContestsStore } from './ContestsStore';
import { ProblemsStore } from './ProblemsStore';
import { TestcasesStore } from './TestcasesStore';
import { LanguagesStore } from './LanguagesStore';
import http from '../utils/http-client';

const lastLogin: number = parseInt(localStorage.getItem('connected') ?? '0');
const SESSION_LENGTH = 24 * 60 * 60 * 1000;

export class RootStore {
  @observable connected: boolean = Date.now() - new Date(lastLogin).getTime() < SESSION_LENGTH;
  @observable profile: User | undefined;

  contestsStore: ContestsStore;
  problemsStore: ProblemsStore;
  testcasesStore: TestcasesStore;
  languagesStore: LanguagesStore;

  constructor() {
    this.contestsStore = new ContestsStore(this);
    this.problemsStore = new ProblemsStore(this);
    this.testcasesStore = new TestcasesStore(this);
    this.languagesStore = new LanguagesStore(this);
    autorun(
      async () => {
        this.connected && this.setProfile(await http.get<User>(`api/current`));
      },
      { delay: 10 },
    );
  }

  @action
  setProfile = (profile: User): User => (this.profile = profile);

  @action
  logout = (): void => {
    this.connected = false;
    localStorage.removeItem('connected');
  };
}

export const rootStore = new RootStore();
