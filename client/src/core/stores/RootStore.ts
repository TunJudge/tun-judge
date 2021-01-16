import { action, autorun, observable } from 'mobx';
import http from '../utils/http-client';
import { User } from '../models';
import { TeamStore } from './TeamStore';
import { UsersStore } from './UsersStore';
import { TeamsStore } from './TeamsStore';
import { PublicStore } from './PublicStore';
import { ContestsStore } from './ContestsStore';
import { ProblemsStore } from './ProblemsStore';
import { TestcasesStore } from './TestcasesStore';
import { LanguagesStore } from './LanguagesStore';
import { JudgeHostsStore } from './JudgeHostsStore';
import { ExecutablesStore } from './ExecutablesStore';
import { TeamCategoriesStore } from './TeamCategoriesStore';

const lastLogin: number = parseInt(localStorage.getItem('connected') ?? '0');
const SESSION_LENGTH = 24 * 60 * 60 * 1000;

export class RootStore {
  @observable connected: boolean = Date.now() - new Date(lastLogin).getTime() < SESSION_LENGTH;
  @observable profile: User | undefined;

  publicStore: PublicStore;

  teamStore: TeamStore;

  usersStore: UsersStore;
  teamsStore: TeamsStore;
  contestsStore: ContestsStore;
  problemsStore: ProblemsStore;
  testcasesStore: TestcasesStore;
  languagesStore: LanguagesStore;
  judgeHostsStore: JudgeHostsStore;
  executablesStore: ExecutablesStore;
  teamCategoriesStore: TeamCategoriesStore;

  constructor() {
    this.publicStore = new PublicStore(this);

    this.teamStore = new TeamStore(this);

    this.usersStore = new UsersStore(this);
    this.teamsStore = new TeamsStore(this);
    this.contestsStore = new ContestsStore(this);
    this.problemsStore = new ProblemsStore(this);
    this.testcasesStore = new TestcasesStore(this);
    this.languagesStore = new LanguagesStore(this);
    this.judgeHostsStore = new JudgeHostsStore(this);
    this.executablesStore = new ExecutablesStore(this);
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
    this.profile = undefined;
    localStorage.removeItem('connected');
  };
}

export const rootStore = new RootStore();
