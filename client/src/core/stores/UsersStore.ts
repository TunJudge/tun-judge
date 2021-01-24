import { action, computed, observable } from 'mobx';
import { Role, User } from '../models';
import http from '../utils/http-client';
import { BaseEntityStore } from './BaseEntityStore';
import { RootStore } from './RootStore';

export class UsersStore extends BaseEntityStore<User> {
  @observable roles: Role[] = [];

  constructor(private readonly rootStore: RootStore) {
    super('users');
  }

  @computed
  get adminUsers(): User[] {
    return this.data.filter((user) => user.role.name === 'admin');
  }

  @computed
  get juryUsers(): User[] {
    return this.data.filter((user) => user.role.name === 'jury');
  }

  @computed
  get judgeHostUsers(): User[] {
    return this.data.filter((user) => user.role.name === 'judge-host');
  }

  @computed
  get teamUsers(): User[] {
    return this.data.filter((user) => user.role.name === 'team');
  }

  @action
  fetchAllRoles = async (): Promise<Role[]> => {
    return (this.roles = await http.get<Role[]>('api/roles'));
  };
}
