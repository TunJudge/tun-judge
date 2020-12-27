import { action, observable } from 'mobx';
import { User } from '../models';
import axios from 'axios';

const hostname = process && process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
const lastLogin: number = parseInt(localStorage.getItem('connected') ?? '0');
const SESSION_LENGTH = 24 * 60 * 60 * 1000;

export class RootStore {
  @observable connected: boolean = Date.now() - new Date(lastLogin).getTime() < SESSION_LENGTH;
  @observable returnUrl: string = '/';
  @observable profile: User | undefined;

  constructor() {
    this.connected &&
      axios
        .get<User>(`${hostname}/api/current`, { withCredentials: true })
        .then((response) => this.setProfile(response.data))
        .catch((error) => error?.response?.status === 401 && this.logout());
  }

  @action
  setProfile = (profile: User) => (this.profile = profile);

  @action
  setReturnUrl = (returnUrl: string) => (this.returnUrl = returnUrl);

  @action
  logout = () => {
    this.connected = false;
    localStorage.removeItem('connected');
  };
}

export const rootStore = new RootStore();
