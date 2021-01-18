import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import ContestForm from './ContestForm';
import { Contest } from '../../../../core/models';
import { MOMENT_DEFAULT_FORMAT } from '../../../shared/extended-form';
import moment from 'moment';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import { observable } from 'mobx';

const ContestsList: React.FC = observer(() => {
  const {
    contestsStore: { data, fetchAll, create, update, remove },
    problemsStore: { fetchAll: fetchAllProblems },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllProblems()]);
  }, [fetchAll, fetchAllProblems]);

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
      header: 'Balloons?',
      field: 'processBalloons',
      render: (contest) => (contest.processBalloons ? 'yes' : 'no'),
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (contest) => (contest.enabled ? 'yes' : 'no'),
    },
    {
      header: 'Public?',
      field: 'public',
      render: (contest) => (contest.public ? 'yes' : 'no'),
    },
    {
      header: 'Verification Required?',
      field: 'verificationRequired',
      render: (contest) => (contest.verificationRequired ? 'yes' : 'no'),
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
    <ListPage<Contest>
      header="Contests"
      data={data}
      columns={columns}
      formItemInitValue={observable({ problems: [] })}
      ItemForm={ContestForm}
      onDelete={remove}
      onRefresh={() => Promise.all([fetchAll(), fetchAllProblems()])}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ContestsList;
