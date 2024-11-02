import { FC } from 'react';
import { DataTable, DataTableColumn } from 'tw-react-components';

import { Judging, Prisma } from '@prisma/client';

import { PageTemplate, SubmissionResult } from '@core/components';
import { useActiveContest, useAuthContext } from '@core/contexts';
import { useOnWebSocketEvent } from '@core/hooks';
import { useFindManySubmission } from '@core/queries';
import { dateComparator, formatRestTime, isContestRunning } from '@core/utils';

type Submission = Prisma.SubmissionGetPayload<{
  include: { problem: true; language: true; judgings: true };
}>;

export const SubmissionsList: FC<{ className?: string }> = ({ className }) => {
  const { profile } = useAuthContext();
  const { currentContest } = useActiveContest();

  const {
    data: submissions,
    isLoading,
    refetch,
  } = useFindManySubmission(
    {
      where: { contestId: currentContest?.id, teamId: profile?.teamId ?? undefined },
      include: { problem: true, language: true, judgings: true },
    },
    { enabled: isContestRunning(currentContest) },
  );

  useOnWebSocketEvent('scoreboard', refetch);
  useOnWebSocketEvent('submissions', refetch);

  const columns: DataTableColumn<Submission>[] = [
    {
      header: '#',
      field: 'id',
      className: 'w-px',
      align: 'center',
    },
    {
      header: 'Time',
      field: 'submitTime',
      align: 'center',
      render: (submission) =>
        currentContest
          ? formatRestTime(
              (new Date(submission.submitTime).getTime() -
                new Date(currentContest.startTime).getTime()) /
                1000,
            )
          : '-',
    },
    {
      header: 'Problem',
      field: 'problem.shortName',
      align: 'center',
    },
    {
      header: 'Language',
      field: 'language.name',
      align: 'center',
    },
    {
      header: 'Result',
      field: 'language',
      align: 'center',
      render: (submission) => <SubmissionResult submission={submission} />,
    },
  ];

  return (
    <PageTemplate className={className} title="Submissions" isSubSection>
      <DataTable
        rows={submissions ?? []}
        columns={columns}
        isLoading={isLoading}
        rowClassName={(submission) => {
          const judging = submission.judgings
            .slice()
            .sort(dateComparator<Judging>('startTime', true))
            .shift();
          if (
            !judging ||
            !judging.result ||
            (currentContest?.verificationRequired && !judging.verified)
          )
            return 'bg-yellow-400 dark:bg-yellow-700';
          return judging.result === 'ACCEPTED'
            ? 'bg-green-400 dark:bg-green-700'
            : 'bg-red-400 dark:bg-red-700';
        }}
      />
    </PageTemplate>
  );
};
