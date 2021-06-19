import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { dateComparator, formatRestTime, isTestcaseSolved } from '../../../../core/helpers';
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
      setFilters,
      fetchAll,
      claim,
      unClaim,
    },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [currentContest, currentPage, filters, judgings, judgeRuns, fetchAll]);

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      render: (submission) => (
        <a className="cursor-pointer" onClick={() => history.push(`/submissions/${submission.id}`)}>
          {formatRestTime(
            (new Date(submission.submitTime).getTime() -
              new Date(currentContest?.startTime ?? 0).getTime()) /
              1000,
          )}
        </a>
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
        <a href={`/problems/${problem.id}`} target="_blank" rel="noreferrer">
          {problem.name}
        </a>
      ),
    },
    {
      header: 'Language',
      field: 'language',
      disabled: (submission) => !submission.valid,
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      render: (submission) => {
        const judging = submission.judgings
          .slice()
          .sort(dateComparator<Judging>('startTime', true))
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
    {
      header: 'Verified by',
      field: 'judgings',
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
              <Button
                onClick={async () => {
                  await unClaim(submission.id);
                  await fetchAll();
                }}
              >
                UnClaim
              </Button>
            ) : (
              `Claimed by ${judging.juryMember?.username}`
            )
          ) : (
            <Button
              onClick={async () => {
                await claim(submission.id);
                history.push(`/submissions/${submission.id}`);
              }}
            >
              Claim
            </Button>
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
        return submission.problem.testcases
          .slice()
          .sort((a, b) => a.rank - b.rank)
          .map((testcase) => (
            <Icon
              key={`${submission.id}-${testcase.id}`}
              name="check square"
              color={isTestcaseSolved(testcase, judging.length ? judging[0] : undefined)}
            />
          ));
      },
    },
  ];

  return (
    <DataTable<Submission>
      header="Submissions"
      data={data}
      columns={columns}
      filters={<SubmissionsFilters filters={filters} onChange={setFilters} />}
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
