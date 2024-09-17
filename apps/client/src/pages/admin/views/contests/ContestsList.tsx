import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { getDisplayDate } from '@core/helpers';
import { Contest } from '@core/models';
import { ContestsStore, RootStore, useStore } from '@core/stores';

import ContestForm from './ContestForm';

const ContestsList: React.FC = observer(() => {
  const { isUserAdmin } = useStore<RootStore>('rootStore');
  const { updateCount, fetchAll, create, update, remove } =
    useStore<ContestsStore>('contestsStore');

  const columns: ListPageTableColumn<Contest>[] = [
    {
      header: 'Short Name',
      field: 'shortName',
      render: (contest) => contest.shortName,
    },
    {
      header: 'Name',
      field: 'name',
      render: (contest) => contest.name,
    },
    {
      header: 'Active Time',
      field: 'activateTime',
      render: (contest) => getDisplayDate(contest.activateTime),
    },
    {
      header: 'Start Time',
      field: 'startTime',
      render: (contest) => getDisplayDate(contest.startTime),
    },
    {
      header: 'End Time',
      field: 'endTime',
      render: (contest) => getDisplayDate(contest.endTime),
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      textAlign: 'center',
      render: (contest) => (contest.enabled ? 'Yes' : 'No'),
    },
    {
      header: 'Public?',
      field: 'public',
      textAlign: 'center',
      render: (contest) => (contest.public ? 'Yes' : 'No'),
    },
    {
      header: 'Teams',
      field: 'teams',
      textAlign: 'center',
      render: (contest) => contest.teams.length,
    },
    {
      header: 'Problems',
      field: 'problems',
      textAlign: 'center',
      render: (contest) => contest.problems.length,
    },
  ];

  return (
    <div className="p-4" test-id="admin-contests-tab">
      <DataTable<Contest>
        header="Contests"
        dataFetcher={fetchAll}
        dataDependencies={[updateCount]}
        columns={columns}
        formItemInitValue={observable({ problems: [] })}
        ItemForm={isUserAdmin ? ContestForm : undefined}
        onDelete={remove}
        withoutActions={!isUserAdmin}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
    </div>
  );
});

export default ContestsList;
