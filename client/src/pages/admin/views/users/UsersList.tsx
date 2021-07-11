import { observer } from 'mobx-react';
import React from 'react';
import { getDisplayDate } from '../../../../core/helpers';
import { User } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import UserForm from './UserForm';

const rolesColors: Record<string, 'green' | 'yellow' | 'red' | 'blue'> = {
  admin: 'red',
  jury: 'yellow',
  'judge-host': 'blue',
  team: 'green',
};

const UsersList: React.FC = observer(() => {
  const {
    profile,
    isUserAdmin,
    usersStore: { fetchAll, create, update, remove },
  } = rootStore;

  const columns: ListPageTableColumn<User>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (user) => user.name,
    },
    {
      header: 'Username',
      field: 'username',
      render: (user) => user.username,
    },
    {
      header: 'Email',
      field: 'email',
      render: (user) => user.email ?? '-',
    },
    {
      header: 'Role',
      field: 'role',
      render: (user) => user.role.description,
    },
    {
      header: 'Last Login',
      field: 'lastLogin',
      render: (user) => (user.lastLogin ? getDisplayDate(user.lastLogin) : '-'),
    },
    {
      header: 'Last Ip',
      field: 'lastIpAddress',
      render: (user) => user.lastIpAddress ?? '-',
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (user) => (user.enabled ? 'Yes' : 'No'),
    },
  ];

  return (
    <DataTable<User>
      header="Users"
      dataFetcher={fetchAll}
      columns={columns}
      ItemForm={isUserAdmin ? UserForm : undefined}
      onDelete={remove}
      withoutActions={!isUserAdmin}
      canDelete={(item) => !!profile && item.username !== profile.username}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      rowBackgroundColor={(item) => rolesColors[item.role.name]}
    />
  );
});

export default UsersList;
