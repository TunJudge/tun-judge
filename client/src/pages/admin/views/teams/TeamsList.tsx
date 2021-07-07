import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Team } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import TeamForm from './TeamForm';

const TeamsList: React.FC = observer(() => {
  const {
    isUserAdmin,
    teamsStore: { data: teams, fetchAll, create, update, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      field: 'user',
      render: (team) => team.user?.username ?? '-',
    },
    {
      header: 'Ip',
      field: 'user',
      render: (team) => team.user?.lastIpAddress ?? '-',
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
    <DataTable<Team>
      header="Teams"
      data={teams}
      columns={columns}
      ItemForm={isUserAdmin ? TeamForm : undefined}
      onDelete={remove}
      onRefresh={fetchAll}
      withoutActions={!isUserAdmin}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      rowBackgroundColor={(item) => (!item.user ? 'red' : 'white')}
    />
  );
});

export default TeamsList;
