import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { rootStore } from '../../../../core/stores/RootStore';
import { languageMap } from '../../../../core/types';
import CodeEditor from '../../../shared/CodeEditor';
import Spinner from '../../../shared/Spinner';
import SubmissionViewDetails from './SubmissionViewDetails';
import SubmissionViewHeader from './SubmissionViewHeader';
import SubmissionsViewJudgingRuns from './SubmissionViewJudgingRuns';

const SubmissionsView: React.FC<RouteChildrenProps<{ id?: string }>> = observer(({ match }) => {
  const {
    updatesCount: { judgings },
    submissionsStore: { item: submission, fetchById },
  } = rootStore;

  useEffect(() => {
    fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/submissions'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchById, judgings]);

  return !submission ? (
    <Spinner />
  ) : (
    <div className="overflow-auto flex flex-col gap-y-4 text-black dark:text-white">
      <SubmissionViewHeader submission={submission} />
      <SubmissionViewDetails submission={submission} />
      <div className="flex flex-col bg-white divide-y border shadow rounded-md dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
        <div className="text-lg font-medium p-3">Code Source</div>
        <div className="p-3">
          <CodeEditor
            readOnly
            value={atob(submission.file.content.payload)}
            lang={languageMap[submission.language.name]}
          />
        </div>
      </div>
      <SubmissionsViewJudgingRuns submission={submission} />
    </div>
  );
});

export default SubmissionsView;
