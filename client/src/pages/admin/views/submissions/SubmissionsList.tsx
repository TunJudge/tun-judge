import { BadgeCheckIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { dateComparator, formatRestTime, getJudgingRunColor } from '../../../../core/helpers';
import { Judging, Submission } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { resultMap } from '../../../../core/types';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import SubmissionsFilters from './SubmissionsFilters';
import SubmissionsListPagination from './SubmissionsListPagination';

const SubmissionsList: React.FC = observer(() => {
  const history = useHistory();
  const {
    profile,
    updatesCount: { judgings, judgeRuns },
    submissionsStore: {
      data,
      totalItems,
      currentPage,
      setCurrentPage,
      filters,
      fetchAll,
      claim,
      unClaim,
    },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [
    currentContest,
    currentPage,
    filters.problems,
    filters.teams,
    filters.languages,
    filters.status,
    judgings,
    judgeRuns,
    fetchAll,
  ]);

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      textAlign: 'center',
      render: (submission) => (
        <div
          className="text-blue-700 cursor-pointer"
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
      disabled: (submission) => !submission.valid,
      render: ({ problem }) => (
        <a
          className="text-blue-700 cursor-pointer"
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
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
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
    {
      header: 'Verified by',
      field: 'judgings',
      textAlign: 'center',
      disabled: (submission) => !submission.valid,
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
          .shift();
        return judging?.result ? (
          judging.verified ? (
            `Yes by ${judging.juryMember.username}`
          ) : judging.juryMember ? (
            judging.juryMember.username === profile?.username ? (
              <div
                className="text-center font-medium text-gray-600 bg-gray-200 hover:bg-grey-100 rounded-md p-2 cursor-pointer"
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
              className="text-center font-medium text-gray-600 bg-gray-200 hover:bg-grey-100 rounded-md p-2 cursor-pointer"
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
          .sort(dateComparator<Judging>('startTime', true));

        return (
          <div className="flex flex-wrap">
            {submission.problem.testcases
              .slice()
              .sort((a, b) => a.rank - b.rank)
              .map((testcase) => {
                const color = getJudgingRunColor(testcase, judging[0]);

                return (
                  <BadgeCheckIcon
                    key={`${submission.id}-${testcase.id}`}
                    className={classNames('w-6 h-6', {
                      'text-green-600': color === 'green',
                      'text-red-600': color === 'red',
                      'text-gray-600': color === 'gray',
                    })}
                  />
                );
              })}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable<Submission>
      header="Submissions"
      data={data}
      columns={columns}
      filters={<SubmissionsFilters filters={filters} />}
      pagination={
        <SubmissionsListPagination
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      }
      onRefresh={fetchAll}
      withoutActions
    />
  );
});

export default SubmissionsList;
