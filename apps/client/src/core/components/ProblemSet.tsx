/// <reference types="vite-plugin-svgr/client" />
import { FileTextIcon, UploadIcon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  Card,
  DataTable,
  DataTableColumn,
  Flex,
  PdfViewerDialog,
  cn,
} from 'tw-react-components';

import { Prisma, ScoreCache, Submission } from '@prisma/client';

import { useActiveContest, useAuthContext } from '@core/contexts';
import { contestStartedAndNotOver, dateComparator, formatBytes } from '@core/utils';

import { NoActiveContest } from './NoActiveContest';
import { PageTemplate } from './PageTemplate';
import { SubmitForm } from './SubmitForm';
import Balloon from './balloon.svg?react';

type ContestProblem = Prisma.ContestProblemGetPayload<{
  include: { problem: true };
}>;

export const ProblemSet: FC<{ className?: string; listMode?: boolean }> = ({
  className,
  listMode,
}) => {
  const { profile, isUserJury } = useAuthContext();
  const { currentContest } = useActiveContest();

  const [viewedProblem, setViewedProblem] = useState<ContestProblem>();
  const [submission, setSubmission] = useState<Partial<Submission>>();

  const columns: DataTableColumn<ContestProblem>[] = [
    {
      header: '#',
      field: 'shortName',
      className: 'w-px',
      align: 'center',
    },
    {
      header: 'Name',
      field: 'problem.name',
      className: 'cursor-pointer',
      render: (contestProblem) => {
        const sc = getScoreCache(contestProblem);
        const shift = currentContest?.scoreCaches
          .slice()
          .filter((sc) => (isUserJury ? sc.restrictedFirstToSolve : sc.firstToSolve))
          .sort(dateComparator<ScoreCache>(isUserJury ? 'restrictedSolveTime' : 'solveTime'))
          .shift();
        const veryFirstToSolve =
          shift?.teamId === profile?.teamId && shift?.problemId === contestProblem.id;
        const nbrBalloons = sc?.correct ? (veryFirstToSolve ? 3 : sc.firstToSolve ? 2 : 1) : 0;

        return (
          <Flex
            className="cursor-pointer"
            justify="between"
            fullWidth
            onClick={() => setViewedProblem(contestProblem)}
          >
            <Flex className="gap-1">
              {contestProblem.problem.name}
              <span className="text-slate-500 dark:text-slate-400">
                ({contestProblem.problem.timeLimit} s,{' '}
                {formatBytes(contestProblem.problem.memoryLimit * 1024)})
              </span>
            </Flex>

            <Flex className="gap-0" align="center">
              {new Array(nbrBalloons).fill(0).map((_, index) => (
                <Balloon key={index} style={{ color: contestProblem.color }} />
              ))}
            </Flex>
          </Flex>
        );
      },
    },
    {
      header: '',
      field: 'shortName',
      className: 'w-px',
      align: 'center',
      hide: !contestStartedAndNotOver(currentContest),
      render: (contestProblem) => (
        <Button
          size="small"
          color="green"
          prefixIcon={UploadIcon}
          onClick={() => setSubmission({ problemId: contestProblem.id })}
        />
      ),
    },
  ];

  const getScoreCache = (contestProblem: ContestProblem): ScoreCache | undefined =>
    currentContest?.scoreCaches.find(
      (sc) => sc.teamId === profile?.teamId && sc.problemId === contestProblem.id,
    );

  const getProblemColor = (contestProblem: ContestProblem) => {
    const scoreCache = getScoreCache(contestProblem);
    if (scoreCache?.correct) return 'bg-green-200 dark:bg-green-800';
    if (scoreCache?.pending) return 'bg-yellow-200 dark:bg-yellow-800';
    if (scoreCache?.submissions) return 'bg-red-200 dark:bg-red-800';
    return 'white';
  };

  return (
    <>
      {listMode ? (
        <PageTemplate className={className} title="Problems" isSubSection>
          <DataTable<ContestProblem>
            rows={currentContest?.problems ?? []}
            columns={columns}
            rowClassName={getProblemColor}
          />
        </PageTemplate>
      ) : !currentContest ? (
        <NoActiveContest />
      ) : (
        <Flex className="mx-auto px-3 py-8 md:max-w-7xl" direction="column" align="center">
          <span className="pb-8 text-center text-3xl font-medium">Contest Problems</span>
          <Flex justify="center" wrap fullWidth>
            {currentContest.problems.map((contestProblem) => (
              <Card
                key={contestProblem.shortName}
                className={cn(
                  'border-border relative flex w-full flex-col bg-white p-0 md:w-1/3 dark:bg-slate-800',
                  getProblemColor(contestProblem),
                )}
              >
                <Flex className="h-full min-h-24 gap-1 px-4 py-3" direction="column">
                  <span className="text-2xl">
                    {contestProblem.shortName} - {contestProblem.problem.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Limits: {contestProblem.problem.timeLimit} s /{' '}
                    {formatBytes(contestProblem.problem.memoryLimit * 1024)}
                  </span>
                  <div
                    className={`absolute right-3 top-3 h-6 w-6 rounded-full border border-black`}
                    style={{ backgroundColor: contestProblem.color }}
                  />
                </Flex>
                <Flex className="flex gap-2 p-2">
                  <Button
                    className="w-full justify-center"
                    color="blue"
                    prefixIcon={FileTextIcon}
                    onClick={() => setViewedProblem(contestProblem)}
                  >
                    PDF
                  </Button>
                  {profile?.teamId && contestStartedAndNotOver(currentContest) && (
                    <Button
                      className="w-full justify-center"
                      color="green"
                      prefixIcon={UploadIcon}
                      onClick={() =>
                        setSubmission({
                          problemId: contestProblem.problemId,
                          teamId: profile.teamId ?? undefined,
                        })
                      }
                    >
                      Submit
                    </Button>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </Flex>
      )}
      <PdfViewerDialog
        open={!!viewedProblem}
        title={`${viewedProblem?.shortName} - ${viewedProblem?.problem.name}`}
        url={`/files/${encodeURIComponent(viewedProblem?.problem.statementFileName ?? '')}`}
        onClose={() => setViewedProblem(undefined)}
      />
      <SubmitForm submission={submission} onClose={() => setSubmission(undefined)} />
    </>
  );
};
