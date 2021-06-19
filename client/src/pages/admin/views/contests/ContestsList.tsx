import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Contest } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import { MOMENT_DEFAULT_FORMAT } from '../../../shared/extended-form';
import ContestForm from './ContestForm';

const ContestsList: React.FC = observer(() => {
  const {
    isUserAdmin,
    contestsStore: { data: contests, fetchAll, create, update, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      render: (contest) => moment(contest.activateTime).format(MOMENT_DEFAULT_FORMAT),
    },
    {
      header: 'Start Time',
      field: 'startTime',
      render: (contest) => moment(contest.startTime).format(MOMENT_DEFAULT_FORMAT),
    },
    {
      header: 'End Time',
      field: 'endTime',
      render: (contest) => moment(contest.endTime).format(MOMENT_DEFAULT_FORMAT),
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (contest) => (contest.enabled ? 'Yes' : 'No'),
    },
    {
      header: 'Public?',
      field: 'public',
      render: (contest) => (contest.public ? 'Yes' : 'No'),
    },
    {
      header: 'Teams',
      field: 'teams',
      render: (contest) => contest.teams.length,
    },
    {
      header: 'Problems',
      field: 'problems',
      render: (contest) => contest.problems.length,
    },
  ];

  return (
    <DataTable<Contest>
      header="Contests"
      data={contests}
      columns={columns}
      formItemInitValue={observable({ problems: [] })}
      ItemForm={isUserAdmin ? ContestForm : undefined}
      onDelete={remove}
      withoutActions={!isUserAdmin}
      onRefresh={fetchAll}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ContestsList;
