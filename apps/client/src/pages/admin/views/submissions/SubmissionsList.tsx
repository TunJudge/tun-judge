import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataTable, DataTableColumn } from 'tw-react-components';

import { Judging, Prisma, Testcase } from '@prisma/client';

import { SubmissionResult } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { dateComparator, formatRestTime } from '@core/utils';
import { useFindFirstContest, useFindManySubmission } from '@models';

type Submission = Prisma.SubmissionGetPayload<{
  include: {
    team: true;
    problem: { include: { testcases: true } };
    language: true;
    judgings: { include: { juryMember: true; runs: { include: { testcase: true } } } };
  };
}>;

export const SubmissionsList: FC = () => {
  const { profile } = useAuthContext();
  const { id: contestId } = useParams();

  const { data: contest } = useFindFirstContest({ where: { id: parseInt(contestId ?? '-1') } });

  const { data: submissions = [], isLoading } = useFindManySubmission({
    where: { contestId: parseInt(contestId ?? '-1') },
    include: {
      team: true,
      problem: { include: { testcases: true } },
      language: true,
      judgings: { include: { juryMember: true, runs: { include: { testcase: true } } } },
    },
    orderBy: { submitTime: 'desc' },
  });

  const columns: DataTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      render: (submission) => (
        <Link className="cursor-pointer text-blue-700" to={`submissions/${submission.id}`}>
          {formatRestTime(
            (new Date(submission.submitTime).getTime() -
              new Date(contest?.startTime ?? 0).getTime()) /
              1000,
          )}
        </Link>
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
          className="cursor-pointer text-blue-700"
          to={`/problems/${problem.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {problem.name}
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
            `Yes by ${judging.juryMember.username}`
          ) : judging.juryMember ? (
            judging.juryMember.username === profile?.username ? (
              <div
                className="hover:bg-grey-100 cursor-pointer rounded-md bg-gray-200 p-2 text-center font-medium text-gray-600"
                onClick={async () => {
                  // await unClaim(submission.id);
                  // await fetchAll();
                }}
              >
                UnClaim
              </div>
            ) : (
              `Claimed by ${judging.juryMember?.username}`
            )
          ) : (
            <div
              className="hover:bg-grey-100 cursor-pointer rounded-md bg-gray-200 p-2 text-center font-medium text-gray-600"
              onClick={async () => {
                // await claim(submission.id);
                // history.push(`/submissions/${submission.id}`);
              }}
            >
              Claim
            </div>
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
            {submission.problem.testcases
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

  return <DataTable rows={submissions} columns={columns} isLoading={isLoading} />;
};

export function getJudgingRunColor(
  testcase: Testcase,
  judging?: Prisma.JudgingGetPayload<{ include: { runs: { include: { testcase: true } } } }>,
): 'gray' | 'green' | 'red' {
  if (!judging) return 'gray';

  const judgeRun = judging.runs.find((r) => r.testcase.id === testcase.id);

  return !judgeRun ? 'gray' : judgeRun.result === 'ACCEPTED' ? 'green' : 'red';
}
