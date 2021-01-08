import { action, autorun, observable } from 'mobx';
import { User } from '../models';
import { ContestsStore } from './ContestsStore';
import { ProblemsStore } from './ProblemsStore';
import { TestcasesStore } from './TestcasesStore';
import { LanguagesStore } from './LanguagesStore';
import http from '../utils/http-client';
import { UsersStore } from './UsersStore';
import { TeamCategoriesStore } from './TeamCategoriesStore';
import { TeamsStore } from './TeamsStore';

const lastLogin: number = parseInt(localStorage.getItem('connected') ?? '0');
const SESSION_LENGTH = 24 * 60 * 60 * 1000;

export class RootStore {
  @observable connected: boolean = Date.now() - new Date(lastLogin).getTime() < SESSION_LENGTH;
  @observable profile: User | undefined;

  usersStore: UsersStore;
  teamsStore: TeamsStore;
  contestsStore: ContestsStore;
  problemsStore: ProblemsStore;
  testcasesStore: TestcasesStore;
  languagesStore: LanguagesStore;
  teamCategoriesStore: TeamCategoriesStore;

  constructor() {
    this.usersStore = new UsersStore(this);
    this.teamsStore = new TeamsStore(this);
    this.contestsStore = new ContestsStore(this);
    this.problemsStore = new ProblemsStore(this);
    this.testcasesStore = new TestcasesStore(this);
    this.languagesStore = new LanguagesStore(this);
    this.teamCategoriesStore = new TeamCategoriesStore(this);
    autorun(
      async () => {
        this.connected && http.get<User>(`api/current`).then(this.setProfile).catch(this.logout);
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
