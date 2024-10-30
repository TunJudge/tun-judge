import { ClipboardPlusIcon, ClipboardXIcon } from 'lucide-react';
import { FC } from 'react';
import { DataTable, DataTableColumn, cn } from 'tw-react-components';

import { JUDGING_RESULT_LABELS } from '@core/constants';
import { useUpdateJudging } from '@core/queries';
import { formatBytes, formatRestTime } from '@core/utils';

import { Judging, Submission } from './SubmissionView';

export const SubmissionViewDetails: FC<{
  submission: Submission;
  highlightedJudging?: Judging;
  setHighlightedJudging: (judging: Judging) => void;
}> = ({ submission, highlightedJudging, setHighlightedJudging }) => {
  const { mutateAsync: updateJudging } = useUpdateJudging();

  const columns: DataTableColumn<Judging>[] = [
    {
      header: 'Team',
      field: 'id',
      align: 'center',
      render: () => submission.team.name,
    },
    {
      header: 'Problem',
      field: 'id',
      align: 'center',
      render: () => submission.problem.problem.name,
    },
    {
      header: 'Language',
      field: 'id',
      align: 'center',
      render: () => submission.language.name,
    },
    {
      header: 'Result',
      field: 'result',
      align: 'center',
      render: (judging) => (
        <b
          className={cn({
            'text-green-600':
              judging.id === highlightedJudging?.id && judging.result === 'ACCEPTED',
            'text-yellow-600': judging.id === highlightedJudging?.id && !judging.result,
            'text-red-600':
              judging.id === highlightedJudging?.id &&
              judging.result &&
              judging.result !== 'ACCEPTED',
          })}
        >
          {JUDGING_RESULT_LABELS[judging.result ?? 'PENDING']}
        </b>
      ),
    },
    {
      header: 'Time',
      field: 'id',
      align: 'center',
      render: (judging) =>
        `${Math.floor(
          judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runTime), 0) * 1000,
        )} ms`,
    },
    {
      header: 'Memory',
      field: 'id',
      align: 'center',
      render: (judging) =>
        formatBytes(
          judging.runs.reduce<number>((pMax, run) => Math.max(pMax, run.runMemory), 0) * 1024,
        ),
    },
    {
      header: 'Sent',
      field: 'id',
      align: 'center',
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
      align: 'center',
      render: (judging) =>
        formatRestTime(
          (new Date(judging.startTime).getTime() -
            new Date(submission.contest.startTime).getTime()) /
            1000,
        ),
    },
  ];

  return (
    <DataTable
      className="sticky top-0 z-10 flex-shrink-0"
      rows={submission.judgings}
      columns={columns}
      noDataMessage="Not judged yet"
      actions={[
        {
          color: 'red',
          icon: ClipboardXIcon,
          label: 'Invalidate',
          hide: (judging) => !judging.valid,
          onClick: (judging) =>
            updateJudging({ where: { id: judging.id }, data: { valid: false } }),
        },
        {
          color: 'green',
          icon: ClipboardPlusIcon,
          label: 'Validate',
          hide: (judging) => judging.valid,
          onClick: (judging) => updateJudging({ where: { id: judging.id }, data: { valid: true } }),
        },
      ]}
      onRowClick={setHighlightedJudging}
      rowClassName={(judging) => (judging.id !== highlightedJudging?.id ? 'opacity-50' : '')}
    />
  );
};

export default SubmissionViewDetails;
