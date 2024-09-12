import { RefreshIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { dateComparator, isSubmissionClaimedByMe } from '@core/helpers';
import { Judging, Submission } from '@core/models';
import { RootStore, SubmissionsStore, useStore } from '@core/stores';

import Tooltip from '@shared/tooltip/Tooltip';

const SubmissionViewHeader: React.FC<{ submission: Submission }> = observer(({ submission }) => {
  const { profile } = useStore<RootStore>('rootStore');
  const { fetchById, ignore, unIgnore, rejudge, claim, unClaim, markVerified } =
    useStore<SubmissionsStore>('submissionsStore');

  const history = useHistory();
  const judging = submission.judgings
    .slice()
    .filter((j) => j.valid)
    .sort(dateComparator<Judging>('startTime', true))
    .shift();

  return (
    <div className="flex items-center shadow rounded-md w-full justify-between p-4 bg-white dark:bg-gray-800">
      <div className="text-xl font-medium">Submission {submission.id}</div>
      <div className="flex items-center space-x-2">
        {judging?.result && (
          <div
            className="text-blue-600 border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md p-2 cursor-pointer"
            onClick={async () => {
              await (submission!.valid ? ignore : unIgnore)(submission!.id);
              await fetchById(submission!.id);
            }}
          >
            {submission.valid ? 'Ignore' : 'UnIgnore'}
          </div>
        )}
        {judging?.result && judging.verified && (
          <div
            className="text-red-600 border border-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md p-2 cursor-pointer"
            onClick={async () => {
              await rejudge(submission!.id);
              await fetchById(submission!.id);
            }}
          >
            Rejudge
          </div>
        )}
        {judging?.result && !judging.verified && (
          <div className="flex space-x-2">
            <div
              className="text-blue-600 border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md p-2 cursor-pointer"
              onClick={async () => {
                if (isSubmissionClaimedByMe(judging, profile)) {
                  await unClaim(submission!.id);
                } else {
                  await claim(submission!.id);
                }
                await fetchById(submission!.id);
              }}
            >
              {isSubmissionClaimedByMe(judging, profile) ? 'UnClaim' : 'Claim'}
            </div>
            <div
              className="text-green-600 border border-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-md p-2 cursor-pointer"
              onClick={async () => {
                await markVerified(submission!.id);
                history.push('/submissions');
              }}
            >
              Mark Verified
            </div>
          </div>
        )}
        <Tooltip content="Refresh">
          <div
            className="hover:bg-gray-200 rounded-md p-2 cursor-pointer dark:hover:bg-gray-700"
            onClick={() => fetchById(submission!.id)}
          >
            <RefreshIcon className="w-6 h-6" />
          </div>
        </Tooltip>
      </div>
    </div>
  );
});

export default SubmissionViewHeader;
