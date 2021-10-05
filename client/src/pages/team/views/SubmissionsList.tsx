import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { contestStartedAndNotOver, dateComparator, formatRestTime } from '../../../core/helpers';
import { Judging, Submission } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { resultMap } from '../../../core/types';
import DataTable, { ListPageTableColumn } from '../../shared/data-table/DataTable';

const SubmissionsList: React.FC = observer(() => {
  const {
    profile,
    publicStore: { currentContest },
    teamStore: { fetchSubmissions },
  } = rootStore;

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      textAlign: 'center',
      render: (submission) =>
        formatRestTime(
          (new Date(submission.submitTime).getTime() -
            new Date(currentContest?.startTime ?? 0).getTime()) /
            1000,
        ),
    },
    {
      header: 'Problem',
      field: 'problem',
      textAlign: 'center',
      render: (submission) =>
        currentContest?.problems?.find((p) => p.problem.id === submission.problem.id)?.shortName ??
        '-',
    },
    {
      header: 'Language',
      field: 'language',
      textAlign: 'center',
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      textAlign: 'center',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .shift();
        return (
          <b
            className={classNames({
              'text-green-600': judging?.result === 'AC',
              'text-red-600': judging?.result && judging.result !== 'AC',
              'text-gray-600': !judging?.result,
            })}
          >
            {resultMap[judging?.result ?? 'PD']}
          </b>
        );
      },
    },
  ];

  const fetchAll = () =>
    currentContest && contestStartedAndNotOver(currentContest) && profile?.team
      ? fetchSubmissions(currentContest.id, profile.team.id)
      : Promise.all([]);

  return (
    <DataTable<Submission>
      header="Submissions"
      emptyMessage="No Submissions"
      dataFetcher={fetchAll}
      dataDependencies={[currentContest, profile]}
      columns={columns}
      withoutActions
      rowBackgroundColor={(submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
          .shift();
        if (
          !judging ||
          !judging.result ||
          (currentContest!.verificationRequired && !judging.verified)
        )
          return 'yellow';
        return judging.result == 'AC' ? 'green' : 'red';
      }}
    />
  );
});

export default SubmissionsList;
