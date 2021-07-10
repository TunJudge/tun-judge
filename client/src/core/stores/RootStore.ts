import { action, autorun, computed, observable } from 'mobx';
import { io, Socket } from 'socket.io-client';
import { User } from '../models';
import http from '../utils/http-client';
import { ClarificationsStore } from './ClarificationsStore';
import { ContestsStore } from './ContestsStore';
import { ExecutablesStore } from './ExecutablesStore';
import { JudgeHostsStore } from './JudgeHostsStore';
import { LanguagesStore } from './LanguagesStore';
import { ProblemsStore } from './ProblemsStore';
import { PublicStore } from './PublicStore';
import { SubmissionsStore } from './SubmissionsStore';
import { TeamCategoriesStore } from './TeamCategoriesStore';
import { TeamsStore } from './TeamsStore';
import { TeamStore } from './TeamStore';
import { TestcasesStore } from './TestcasesStore';
import { ToastsStore } from './ToastsStore';
import { UsersStore } from './UsersStore';

const SESSION_LENGTH = 24 * 60 * 60 * 1000;

const updateEvents = ['contests', 'scoreboard', 'submissions', 'judgings', 'judgeRuns'] as const;
type UpdateEvents = typeof updateEvents[number];

type AppLocalCache = {
  connected?: number;
  darkMode: boolean;
  menuCollapsed: boolean;
  currentContestId?: number;
};

export class RootStore {
  @observable appLocalCache: AppLocalCache = JSON.parse(localStorage.getItem('settings') ?? '{}');

  @observable connected: boolean =
    Date.now() - new Date(this.appLocalCache.connected ?? 0).getTime() < SESSION_LENGTH;

  @observable profile: User | undefined;

  private _updatesCount: Record<UpdateEvents, number> = {
    contests: 1,
    judgings: 1,
    judgeRuns: 1,
    scoreboard: 1,
    submissions: 1,
  };
  @observable updatesCount: Record<UpdateEvents, number> = {
    contests: 1,
    judgings: 1,
    judgeRuns: 1,
    scoreboard: 1,
    submissions: 1,
  };

  socket: Socket = io(`/ws`, { transports: ['websocket'] });

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
  submissionsStore: SubmissionsStore;
  teamCategoriesStore: TeamCategoriesStore;
  clarificationsStore: ClarificationsStore;

  toastsStore: ToastsStore;

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
    this.submissionsStore = new SubmissionsStore(this);
    this.teamCategoriesStore = new TeamCategoriesStore(this);
    this.clarificationsStore = new ClarificationsStore(this);

    this.toastsStore = new ToastsStore();

    this.initiateWebSocket();

    autorun(
      () =>
        this.connected && http.get<User>(`api/current`).then(this.setProfile).catch(this.logout),
      { delay: 10 },
    );

    autorun(() => {
      console.log('reaction');
      localStorage.setItem('settings', JSON.stringify(this.appLocalCache));
    });
  }

  private initiateWebSocket() {
    this.socket.emit('subscribe');
    for (const event of updateEvents) {
      this.socket.on(event, () => this._updatesCount[event]++);
    }
    setInterval(() => {
      for (const event of updateEvents) {
        this.updatesCount[event] = this._updatesCount[event];
      }
    }, 2000);
  }

  @computed
  get isUserJury(): boolean {
    return !!this.profile && ['admin', 'jury'].includes(this.profile.role.name);
  }

  @computed
  get isUserAdmin(): boolean {
    return !!this.profile && this.profile.role.name === 'admin';
  }

  @action
  setProfile = (profile: User): User => (this.profile = profile);

  @action
  setDarkMode = (darkMode: boolean): void => {
    this.appLocalCache.darkMode = darkMode;
  };

  @action
  logout = (): void => {
    this.connected = false;
    this.profile = undefined;
    delete this.appLocalCache.connected;
  };
}

export const rootStore = new RootStore();
