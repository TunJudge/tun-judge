import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import { Judging, Submission, Testcase } from '../../../../core/models';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import { formatRestTime } from '../../../../core/helpers';
import { Button, Icon } from 'semantic-ui-react';

const resultMap = {
  AC: 'Accepted',
  WA: 'Wrong Answer',
  TLE: 'Time Limit Exceeded',
  MLE: 'Memory Limit Exceeded',
  RE: 'Runtime Error',
  CE: 'Compile Error',
};

const SubmissionsList: React.FC = observer(() => {
  const {
    submissionsStore: { data, fetchAll },
    publicStore: { currentContest },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const columns: ListPageTableColumn<Submission>[] = [
    {
      header: 'Time',
      field: 'submitTime',
      render: (submission) =>
        formatRestTime(
          (new Date(submission.submitTime).getTime() -
            new Date(currentContest?.startTime ?? 0).getTime()) /
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
      render: (submission) => submission.problem.name,
    },
    {
      header: 'Language',
      field: 'language',
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      render: (submission) => {
        const judging = submission.judgings.find((j) => j.valid && j.endTime);
        return (
          <b style={{ color: judging ? (judging.result === 'AC' ? 'green' : 'red') : 'grey' }}>
            {judging?.result ? resultMap[judging.result] : 'Pending'}
          </b>
        );
      },
    },
    {
      header: 'Verified by',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        );
        return judging.length && judging[0].verified ? (
          `Yes by ${judging[0].juryMember.username}`
        ) : (
          <Button>Claim</Button>
        );
      },
    },
    {
      header: 'Test Results',
      field: 'judgings',
      render: (submission) => {
        const judging = submission.judgings.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        );
        return submission.problem.testcases
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
    <ListPage<Submission> header="Submissions" data={data} columns={columns} onRefresh={fetchAll} />
  );
});

export default SubmissionsList;

function isTestcaseSolved(testcase: Testcase, judging?: Judging): 'grey' | 'green' | 'red' {
  if (!judging) return 'grey';
  const judgeRun = judging.runs.find((r) => r.testcase.id === testcase.id);
  return !judgeRun ? 'grey' : judgeRun.result === 'AC' ? 'green' : 'red';
}
