import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { dateComparator, formatRestTime, getJudgingRunColor } from '@core/helpers';
import { Judging, Submission } from '@core/models';
import { PublicStore, RootStore, SubmissionsStore, useStore } from '@core/stores';
import SubmissionResult from '@shared/SubmissionResult';
import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';

import SubmissionsFilters from './SubmissionsFilters';
import SubmissionsListPagination from './SubmissionsListPagination';

const SubmissionsList: React.FC = observer(() => {
  const { profile, updatesCount } = useStore<RootStore>('rootStore');
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { totalItems, currentPage, setCurrentPage, filters, fetchAll, claim, unClaim } =
    useStore<SubmissionsStore>('submissionsStore');

  const history = useHistory();

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      textAlign: 'center',
      render: (submission) => (
        <div
          className="cursor-pointer text-blue-700"
          onClick={() => history.push(`/submissions/${submission.id}`)}
        >
          {formatRestTime(
            (new Date(submission.submitTime).getTime() -
              new Date(currentContest?.startTime ?? 0).getTime()) /
              1000,
          )}
        </div>
      ),
    },
    {
      header: 'Team',
      field: 'team',
      disabled: (submission) => !submission.valid,
      render: (submission) => submission.team.name,
    },
    {
      header: 'Problem',
      field: 'problem',
      textAlign: 'center',
      disabled: (submission) => !submission.valid,
      render: ({ problem }) => (
        <a
          className="cursor-pointer text-blue-700"
          href={`/problems/${problem.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {problem.name}
        </a>
      ),
    },
    {
      header: 'Language',
      field: 'language',
      textAlign: 'center',
      disabled: (submission) => !submission.valid,
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      textAlign: 'center',
      render: (submission) => <SubmissionResult submission={submission} />,
    },
    {
      header: 'Verified by',
      field: 'judgings',
      textAlign: 'center',
      disabled: (submission) => !submission.valid,
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
                  await unClaim(submission.id);
                  await fetchAll();
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
                await claim(submission.id);
                history.push(`/submissions/${submission.id}`);
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

  return (
    <div className="p-4">
      <DataTable<Submission>
        header="Submissions"
        dataFetcher={fetchAll}
        dataDependencies={[
          currentContest,
          currentPage,
          filters.problems,
          filters.teams,
          filters.languages,
          filters.status,
          updatesCount.judgings,
          updatesCount.judgeRuns,
          fetchAll,
        ]}
        columns={columns}
        filters={<SubmissionsFilters filters={filters} />}
        pagination={
          <SubmissionsListPagination
            totalItems={totalItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        }
        withoutActions
      />
    </div>
  );
});

export default SubmissionsList;
