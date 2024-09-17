import CodeEditor from '@shared/CodeEditor';
import Spinner from '@shared/Spinner';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';

import { dateComparator } from '@core/helpers';
import { Judging } from '@core/models';
import { RootStore, SubmissionsStore, useStore } from '@core/stores';
import { languageMap } from '@core/types';

import SubmissionViewDetails from './SubmissionViewDetails';
import SubmissionViewHeader from './SubmissionViewHeader';
import SubmissionsViewJudgingRuns from './SubmissionViewJudgingRuns';

const SubmissionsView: React.FC<RouteChildrenProps<{ id?: string }>> = observer(({ match }) => {
  const { updatesCount } = useStore<RootStore>('rootStore');
  const { item: submission, fetchById } = useStore<SubmissionsStore>('submissionsStore');

  const [highlightedJudging, setHighlightedJudging] = useState<Judging | undefined>();

  useEffect(() => {
    fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/submissions'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchById, updatesCount.judgings]);

  useEffect(() => {
    if (submission) {
      setHighlightedJudging(
        submission.judgings
          .slice()
          .filter((j) => j.valid)
          .sort(dateComparator<Judging>('startTime', true))[0],
      );
    }
  }, [submission]);

  return !submission ? (
    <Spinner />
  ) : (
    <div className="flex flex-col gap-y-4 overflow-auto p-4 text-black dark:text-white">
      <SubmissionViewHeader submission={submission} />
      <SubmissionViewDetails
        submission={submission}
        highlightedJudging={highlightedJudging}
        setHighlightedJudging={setHighlightedJudging}
      />
      <div className="flex flex-col divide-y rounded-md bg-white shadow dark:divide-gray-700 dark:bg-gray-800">
        <div className="p-3 text-lg font-medium">Code Source</div>
        <div className="p-3">
          <CodeEditor
            readOnly
            value={atob(submission.file.content.payload)}
            lang={languageMap[submission.language.name]}
          />
        </div>
      </div>
      <SubmissionsViewJudgingRuns judging={highlightedJudging} />
    </div>
  );
});

export default SubmissionsView;
