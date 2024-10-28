import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable, DataTableColumn } from 'tw-react-components';

import { Judging, Prisma } from '@prisma/client';

import { useAuthContext } from '@core/contexts';
import { useFindFirstContest, useFindManySubmission } from '@core/queries';
import { dateComparator, formatRestTime, isContestRunning } from '@core/utils';

type Submission = Prisma.SubmissionGetPayload<{
  include: { problem: true; language: true; judgings: true };
}>;

export const SubmissionsList: FC = () => {
  const { profile } = useAuthContext();
  const { id: contestId } = useParams();

  const { data: contest } = useFindFirstContest({
    where: { id: parseInt(contestId ?? '-1') },
    include: { problems: { include: { problem: true } } },
  });

  const { data: submissions, isLoading } = useFindManySubmission(
    {
      where: { contestId: contest?.id, teamId: profile?.team?.id },
      include: { problem: true, language: true, judgings: true },
    },
    {
      enabled: isContestRunning(contest),
    },
  );

  const columns: DataTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      align: 'center',
      render: (submission) =>
        formatRestTime(
          (new Date(submission.submitTime).getTime() -
            new Date(contest?.startTime ?? 0).getTime()) /
            1000,
        ),
    },
    {
      header: 'Problem',
      field: 'problem',
      align: 'center',
      render: (submission) =>
        contest?.problems?.find((p) => p.problem.id === submission.problem.id)?.shortName ?? '-',
    },
    {
      header: 'Language',
      field: 'language.name',
      align: 'center',
    },
    // {
    //   header: 'Result',
    //   field: 'language',
    //   align: 'center',
    //   render: (submission) => <SubmissionResult submission={submission} />,
    // },
  ];

  return (
    <DataTable
      rows={submissions ?? []}
      columns={columns}
      isLoading={isLoading}
      rowClassName={(submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
          .shift();
        if (!judging || !judging.result || (contest?.verificationRequired && !judging.verified))
          return 'yellow';
        return judging.result === 'ACCEPTED'
          ? 'bg-green-400 dark:bg-green-700'
          : 'bg-red-400 dark:bg-red-700';
      }}
    />
  );
};
