import { RootStore } from './RootStore';
import { action, computed, observable } from 'mobx';
import { Role, User } from '../models';
import http from '../utils/http-client';

export class UsersStore {
  @observable data: User[] = [];
  @observable roles: Role[] = [];

  constructor(private readonly rootStore: RootStore) {}

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
  fetchAll = async (): Promise<User[]> => {
    return (this.data = await http.get<User[]>('api/users'));
  };

  @action
  fetchAllRoles = async (): Promise<Role[]> => {
    return (this.roles = await http.get<Role[]>('api/roles'));
  };

  @action
  create = async (user: Partial<User>): Promise<void> => {
    await http.post<User>('api/users', user);
    await this.fetchAll();
  };

  @action
  update = async (user: Partial<User>): Promise<void> => {
    await http.put<User>(`api/users/${user.id}`, user);
    await this.fetchAll();
  };

  @action
  remove = async (id: number): Promise<void> => {
    await http.delete(`api/users/${id}`);
    await this.fetchAll();
  };
}
