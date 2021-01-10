import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import ListPage, { ListPageTableColumn } from '../../shared/ListPage';
import { rootStore } from '../../../core/stores/RootStore';
import { Submission } from '../../../core/models';
import { formatRestTime } from '../../../core/helpers';

let interval: NodeJS.Timeout | undefined = undefined;

const SubmissionsList: React.FC = observer(() => {
  const {
    profile,
    publicStore: { currentContest },
    teamStore: { submissions, fetchSubmissions },
  } = rootStore;

  useEffect(() => {
    if (profile?.team && currentContest?.id) {
      fetchSubmissions(currentContest.id, profile.team.id);
      interval && clearInterval(interval);
      interval = setInterval(() => fetchSubmissions(currentContest.id, profile.team.id), 10000);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [profile?.team, currentContest?.id, fetchSubmissions]);

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
      header: 'Problem',
      field: 'problem',
      render: (submission) =>
        currentContest?.problems?.find((p) => p.problem.id === submission.problem.id)?.shortName ??
        '-',
    },
    {
      header: 'Language',
      field: 'language',
      render: (submission) => submission.language.name,
    },
    {
      header: 'Result',
      field: 'language',
      render: (submission) => submission.id,
    },
  ];

  return (
    <ListPage<Submission>
      header="Submissions"
      emptyMessage="No Submissions"
      data={submissions}
      columns={columns}
      withoutActions
      onRefresh={() => fetchSubmissions(currentContest!.id, profile!.team.id)}
      rowBackgroundColor={() => '#fbbd08'}
    />
  );
});

export default SubmissionsList;
