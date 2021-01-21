import { action, autorun, computed, observable } from 'mobx';
import { connect, Socket } from 'socket.io-client';
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
import { SubmissionsStore } from './SubmissionsStore';

const hostname = process && process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
const lastLogin: number = parseInt(localStorage.getItem('connected') ?? '0');
const SESSION_LENGTH = 24 * 60 * 60 * 1000;

const updateEvents = ['contests', 'scoreboard', 'submissions', 'judgeRuns'] as const;
type UpdateEvents = typeof updateEvents[number];

export class RootStore {
  @observable connected: boolean = Date.now() - new Date(lastLogin).getTime() < SESSION_LENGTH;
  @observable profile: User | undefined;
  private _updatesCount: Record<UpdateEvents, number> = {
    contests: 1,
    judgeRuns: 1,
    scoreboard: 1,
    submissions: 1,
  };
  @observable updatesCount: Record<UpdateEvents, number> = {
    contests: 1,
    judgeRuns: 1,
    scoreboard: 1,
    submissions: 1,
  };

  socket: typeof Socket = connect(`${hostname}/ws`, { transports: ['websocket'] });

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

    this.initiateWebSocket();

    autorun(
      () =>
        this.connected && http.get<User>(`api/current`).then(this.setProfile).catch(this.logout),
      { delay: 10 },
    );
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
  logout = (): void => {
    this.connected = false;
    this.profile = undefined;
    localStorage.removeItem('connected');
  };
}

export const rootStore = new RootStore();
