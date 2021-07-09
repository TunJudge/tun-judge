import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Contest } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import { getDisplayDate } from '../../../shared/extended-form';
import ContestForm from './ContestForm';

const ContestsList: React.FC = observer(() => {
  const {
    isUserAdmin,
    contestsStore: { fetchAll, create, update, remove },
  } = rootStore;

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
    <DataTable<Contest>
      header="Contests"
      dataFetcher={fetchAll}
      columns={columns}
      formItemInitValue={observable({ problems: [] })}
      ItemForm={isUserAdmin ? ContestForm : undefined}
      onDelete={remove}
      withoutActions={!isUserAdmin}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ContestsList;
