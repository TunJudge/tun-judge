import classNames from 'classnames';
import React from 'react';
import { formatRestTime } from '../../../../core/helpers';
import { Judging, Submission } from '../../../../core/models';
import { resultMap } from '../../../../core/types';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';

const SubmissionViewDetails: React.FC<{
  submission: Submission;
}> = ({ submission }) => {
  const columns: ListPageTableColumn<Judging>[] = [
    {
      header: 'Team',
      field: 'id',
      textAlign: 'center',
      render: () => submission.team.name,
    },
    {
      header: 'Problem',
      field: 'id',
      textAlign: 'center',
      render: () => submission.problem.name,
    },
    {
      header: 'Language',
      field: 'id',
      textAlign: 'center',
      render: () => submission.language.name,
    },
    {
      header: 'Result',
      field: 'result',
      textAlign: 'center',
      render: (judging, index) => (
        <b
          className={classNames({
            'text-green-600': !index && judging.result === 'AC',
            'text-red-600': !index && judging.result && judging.result !== 'AC',
          })}
        >
          {resultMap[judging.result ?? 'PD']}
        </b>
      ),
    },
    {
      header: 'Time',
      field: 'id',
      textAlign: 'center',
      render: (judging) =>
        `${Math.floor(
          judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runTime), 0) * 1000,
        )} ms`,
    },
    {
      header: 'Memory',
      field: 'id',
      textAlign: 'center',
      render: (judging) =>
        `${Math.floor(
          judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runTime), 0) * 1000,
        )} ms`,
    },
    {
      header: 'Sent',
      field: 'id',
      textAlign: 'center',
      render: () =>
        formatRestTime(
          (new Date(submission.submitTime).getTime() -
            new Date(submission.contest.startTime).getTime()) /
            1000,
        ),
    },
    {
      header: 'Judged',
      field: 'id',
      textAlign: 'center',
      render: (judging) =>
        formatRestTime(
          (new Date(judging.startTime).getTime() -
            new Date(submission.contest.startTime).getTime()) /
            1000,
        ),
    },
  ];

  return (
    <div>
      <DataTable
        dataFetcher={() => Promise.resolve(submission.judgings)}
        columns={columns}
        withoutActions
        emptyMessage="Not judged yet"
        notSortable
        disabled={(_, index) => index > 0}
      />
    </div>
  );
};

export default SubmissionViewDetails;
