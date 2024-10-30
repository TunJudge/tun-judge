import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, DataTable, DataTableColumn } from 'tw-react-components';

import { Judging, Prisma, Testcase } from '@prisma/client';

import { SubmissionResult } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useFindFirstContest, useFindManySubmission, useUpdateJudging } from '@core/queries';
import { dateComparator, formatRestTime } from '@core/utils';

type Submission = Prisma.SubmissionGetPayload<{
  include: {
    team: true;
    language: true;
    problem: { include: { problem: { include: { testcases: true } } } };
    judgings: { include: { juryMember: true; runs: { include: { testcase: true } } } };
  };
}>;

export const SubmissionsList: FC = () => {
  const { profile } = useAuthContext();
  const { contestId } = useParams();
  const navigate = useNavigate();

  const { data: contest } = useFindFirstContest({ where: { id: parseInt(contestId ?? '-1') } });
  const { data: submissions = [], isLoading } = useFindManySubmission({
    where: { contestId: parseInt(contestId ?? '-1') },
    include: {
      team: true,
      language: true,
      problem: { include: { problem: { include: { testcases: true } } } },
      judgings: { include: { juryMember: true, runs: { include: { testcase: true } } } },
    },
    orderBy: { submitTime: 'desc' },
  });
  const { mutateAsync: updateJudging } = useUpdateJudging();

  const claimSubmission = async (judgingId: number) => {
    if (!profile) return;

    await updateJudging({
      where: { id: judgingId },
      data: { juryMemberId: profile.id },
    });
  };

  const unClaimSubmission = async (judgingId: number) => {
    if (!profile) return;

    await updateJudging({
      where: { id: judgingId },
      data: { juryMemberId: null },
    });
  };

  const columns: DataTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      render: (submission) =>
        formatRestTime(
          (new Date(submission.submitTime).getTime() -
            new Date(contest?.startTime ?? 0).getTime()) /
            1000,
        ),
    },
    {
      header: 'Team',
      field: 'team',
      render: (submission) => submission.team.name,
    },
    {
      header: 'Problem',
      field: 'problem',
      render: ({ problem }) => (
        <Link
          className="cursor-pointer text-blue-700 dark:text-blue-500"
          to={`/problems/${problem.id}`}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noreferrer"
        >
          {problem.problem.name}
        </Link>
      ),
    },
    {
      header: 'Language',
      field: 'language',
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'judgings',
      render: (submission) => <SubmissionResult submission={submission} />,
    },
    {
      header: 'Verified by',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .filter((j) => j.valid)
          .sort(dateComparator<Judging>('startTime', true))
          .shift();

        return judging?.result ? (
          judging.verified ? (
            `Yes by ${judging.juryMember?.username}`
          ) : judging.juryMember ? (
            judging.juryMember.username === profile?.username ? (
              <Button onClick={() => unClaimSubmission(judging.id)}>Me (release)</Button>
            ) : (
              `Claimed by ${judging.juryMember?.username}`
            )
          ) : (
            <Button onClick={() => claimSubmission(judging.id)}>Claim</Button>
          )
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Test Results',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .filter((j) => j.valid)
          .sort(dateComparator<Judging>('startTime', true));

        return (
          <div className="flex flex-wrap">
            {submission.problem.problem.testcases
              .slice()
              .sort((a, b) => a.rank - b.rank)
              .map((testcase) => {
                const color = getJudgingRunColor(testcase, judging[0]);

                return color === 'gray' ? (
                  <MinusCircleIcon
                    key={`${submission.id}-${testcase.id}`}
                    className="h-6 w-6 text-gray-600"
                  />
                ) : color === 'red' ? (
                  <XCircleIcon
                    key={`${submission.id}-${testcase.id}`}
                    className="h-6 w-6 text-red-600"
                  />
                ) : (
                  <CheckCircleIcon
                    key={`${submission.id}-${testcase.id}`}
                    className="h-6 w-6 text-green-600"
                  />
                );
              })}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      rows={submissions}
      columns={columns}
      isLoading={isLoading}
      onRowClick={(submission) => navigate(`${submission.id}`)}
    />
  );
};

export function getJudgingRunColor(
  testcase: Testcase,
  judging?: Prisma.JudgingGetPayload<{ include: { runs: { include: { testcase: true } } } }>,
): 'gray' | 'green' | 'red' {
  if (!judging) return 'gray';

  const judgeRun = judging.runs.find((r) => r.testcase.id === testcase.id);

  return !judgeRun ? 'gray' : judgeRun.result === 'ACCEPTED' ? 'green' : 'red';
}
