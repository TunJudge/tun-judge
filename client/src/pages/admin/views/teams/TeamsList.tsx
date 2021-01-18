import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import TeamForm from './TeamForm';
import { Team } from '../../../../core/models';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';

const TeamsList: React.FC = observer(() => {
  const {
    teamsStore: { data, fetchAll, create, update, remove },
    usersStore: { fetchAll: fetchAllCategories },
    contestsStore: { fetchAll: fetchAllContests },
    teamCategoriesStore: { fetchAll: fetchAllUsers },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllUsers(), fetchAllContests(), fetchAllCategories()]);
  }, [fetchAll, fetchAllUsers, fetchAllContests, fetchAllCategories]);

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
      render: (team) => (team.enabled ? 'yes' : 'no'),
    },
    {
      header: 'Contests',
      field: 'contests',
      render: (team) => team.contests.length,
    },
  ];

  return (
    <ListPage<Team>
      header="Teams"
      data={data}
      columns={columns}
      ItemForm={TeamForm}
      onDelete={remove}
      onRefresh={() =>
        Promise.all([fetchAll(), fetchAllUsers(), fetchAllContests(), fetchAllCategories()])
      }
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      rowBackgroundColor={(item) => (!item.user ? '#FFC2C2' : 'white')}
    />
  );
});

export default TeamsList;
