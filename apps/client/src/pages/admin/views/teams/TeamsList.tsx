import { observer } from 'mobx-react';
import React from 'react';

import { Team } from '@core/models';
import { RootStore, TeamsStore, useStore } from '@core/stores';
import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';

import TeamForm from './TeamForm';

const TeamsList: React.FC = observer(() => {
  const { isUserAdmin } = useStore<RootStore>('rootStore');
  const { fetchAll, updateCount, create, update, remove } = useStore<TeamsStore>('teamsStore');

  const columns: ListPageTableColumn<Team>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (team) => team.name,
    },
    {
      header: 'Category',
      field: 'category',
      render: (team) => team.category.name,
    },
    {
      header: 'User',
      field: 'users',
      render: (team) =>
        team.users.map((user) => `${user.username} (${user.lastIpAddress ?? '-'})`).join(', ') ||
        '-',
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (team) => (team.enabled ? 'Yes' : 'No'),
    },
    {
      header: 'Contests',
      field: 'contests',
      render: (team) => team.contests.length,
    },
  ];

  return (
    <div className="p-4">
      <DataTable<Team>
        header="Teams"
        dataFetcher={fetchAll}
        dataDependencies={[updateCount]}
        columns={columns}
        ItemForm={isUserAdmin ? TeamForm : undefined}
        onDelete={remove}
        withoutActions={!isUserAdmin}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
        rowBackgroundColor={(item) => (!item.users.length ? 'red' : 'white')}
      />
    </div>
  );
});

export default TeamsList;
