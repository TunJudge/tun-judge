import { action, computed, observable } from 'mobx';

import { Role, User } from '../models';
import http from '../utils/http-client';
import { BaseEntityStore } from './BaseEntityStore';

export class UsersStore extends BaseEntityStore<User> {
  @observable roles: Role[] = [];

  constructor() {
    super('users');
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
