import { observer } from 'mobx-react';
import React from 'react';
import { dateComparator, formatRestTime } from '../../../core/helpers';
import { Judging, Submission } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { resultMap } from '../../../core/types';
import DataTable, { ListPageTableColumn } from '../../shared/data-table/DataTable';

const SubmissionsList: React.FC = observer(() => {
  const {
    profile,
    publicStore: { currentContest },
    teamStore: { submissions, fetchSubmissions },
  } = rootStore;

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
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
      render: (submission) =>
        currentContest?.problems?.find((p) => p.problem.id === submission.problem.id)?.shortName ??
        '-',
    },
    {
      header: 'Language',
      field: 'language',
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .shift();
        return (
          <b
            style={{
              color: judging?.result ? (judging.result === 'AC' ? 'green' : 'red') : 'grey',
            }}
          >
            {resultMap[judging?.result ?? 'PD']}
          </b>
        );
      },
    },
  ];

  return (
    <DataTable<Submission>
      header="Submissions"
      emptyMessage="No Submissions"
      data={submissions}
      columns={columns}
      withoutActions
      onRefresh={() => fetchSubmissions(currentContest!.id, profile!.team.id)}
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
          return '#fff9c2';
        return judging.result == 'AC' ? '#B3FFC2' : '#FFC2C2';
      }}
    />
  );
});

export default SubmissionsList;
