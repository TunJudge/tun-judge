import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { User } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import { MOMENT_DEFAULT_FORMAT } from '../../../shared/extended-form';
import UserForm from './UserForm';

const rolesColors = {
  admin: '#FFC2C2',
  jury: '#FFEAC2',
  'judge-host': '#90d3ff',
  team: '#B3FFC2',
};

const UsersList: React.FC = observer(() => {
  const {
    profile,
    isUserAdmin,
    usersStore: {
      adminUsers,
      juryUsers,
      judgeHostUsers,
      teamUsers,
      fetchAll,
      create,
      update,
      remove,
    },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      render: (user) => (user.enabled ? 'Yes' : 'No'),
    },
  ];

  return (
    <DataTable<User>
      header="Users"
      data={[...adminUsers, ...juryUsers, ...judgeHostUsers, ...teamUsers]}
      columns={columns}
      ItemForm={isUserAdmin ? UserForm : undefined}
      onDelete={remove}
      withoutActions={!isUserAdmin}
      canDelete={(item) => !!profile && item.username !== profile.username}
      onRefresh={fetchAll}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      rowBackgroundColor={(item) => (rolesColors as any)[item.role.name]}
    />
  );
});

export default UsersList;
