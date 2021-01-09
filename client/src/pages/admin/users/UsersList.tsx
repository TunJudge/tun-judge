import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import UserForm from './UserForm';
import { User } from '../../../core/models';
import moment from 'moment';
import { MOMENT_DEFAULT_FORMAT } from '../../shared/extended-form';
import ListPage, { ListPageTableColumn } from '../../shared/ListPage';

const rolesColors = {
  admin: '#FFC2C2',
  jury: '#FFEAC2',
  team: '#B3FFC2',
};

const UsersList: React.FC = observer(() => {
  const {
    profile,
    usersStore: {
      adminUsers,
      juryUsers,
      teamUsers,
      fetchAll,
      fetchAllRoles,
      create,
      update,
      remove,
    },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllRoles()]);
  }, [fetchAll, fetchAllRoles]);

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
      render: (user) =>
        user.lastLogin ? moment(user.lastLogin).format(MOMENT_DEFAULT_FORMAT) : '-',
    },
    {
      header: 'Last Ip',
      field: 'lastIpAddress',
      render: (user) => user.lastIpAddress ?? '-',
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (user) => (user.enabled ? 'true' : 'false'),
    },
  ];

  return (
    <ListPage<User>
      header="Users"
      data={[...adminUsers, ...juryUsers, ...teamUsers]}
      columns={columns}
      ItemForm={UserForm}
      onDelete={remove}
      canDelete={(item) => !!profile && item.username !== profile.username}
      onRefresh={() => Promise.all([fetchAll(), fetchAllRoles()])}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      rowBackgroundColor={(item) => (rolesColors as any)[item.role.name]}
    />
  );
});

export default UsersList;
