import { action, autorun, computed, observable } from 'mobx';
import { Socket, io } from 'socket.io-client';

import { User } from '../models';
import http from '../utils/http-client';
import { ToastsStore } from './ToastsStore';
import { TooltipStore } from './TooltipStore';

const SESSION_LENGTH = 24 * 60 * 60 * 1000;

const updateEvents = [
  'contests',
  'scoreboard',
  'submissions',
  'judgings',
  'judgeRuns',
  'clarifications',
] as const;
type UpdateEvents = (typeof updateEvents)[number];

type AppLocalCache = {
  connected?: number;
  darkMode: boolean;
  menuCollapsed: boolean;
  currentContestId?: number;
};

export class RootStore {
  @observable appLocalCache: AppLocalCache = JSON.parse(localStorage.getItem('settings') ?? '{}');

  @observable profile: User | undefined;

  private _updatesCount: Record<UpdateEvents, number> = {
    contests: 1,
    judgings: 1,
    judgeRuns: 1,
    scoreboard: 1,
    submissions: 1,
    clarifications: 1,
  };
  @observable updatesCount: Record<UpdateEvents, number> = {
    contests: 1,
    judgings: 1,
    judgeRuns: 1,
    scoreboard: 1,
    submissions: 1,
    clarifications: 1,
  };

  socket: Socket = io(`/ws`, { transports: ['websocket'] });

  toastsStore: ToastsStore;
  tooltipStore: TooltipStore;

  constructor() {
    this.toastsStore = new ToastsStore();
    this.tooltipStore = new TooltipStore();

    this.initiateWebSocket();

    autorun(
      () =>
        this.connected && http.get<User>(`api/current`).then(this.setProfile).catch(this.logout),
      { delay: 10 },
    );

    autorun(() => localStorage.setItem('settings', JSON.stringify(this.appLocalCache)));
  }

  private initiateWebSocket() {
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
  get connected(): boolean {
    return Date.now() - new Date(this.appLocalCache.connected ?? 0).getTime() < SESSION_LENGTH;
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
  logout = async (): Promise<void> => {
    this.profile = undefined;
    this.appLocalCache.connected = undefined;
  };
}

export const rootStore = new RootStore();
