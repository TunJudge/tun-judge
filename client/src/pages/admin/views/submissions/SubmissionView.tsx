import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
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
    submissionsStore: { item: submission, cleanItem, fetchById },
  } = rootStore;

  useEffect(() => {
    fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/submissions'));
    return cleanItem;
  }, [fetchById, cleanItem, judgings, match]);

  return submission ? (
    <>
      <SubmissionViewHeader submission={submission} />
      <SubmissionViewDetails submission={submission} />
      <Segment.Group>
        <Segment as={Header}>Code Source</Segment>
        <Segment>
          <CodeEditor
            readOnly
            value={atob(submission.file.content.payload)}
            lang={languageMap[submission.language.name]}
          />
        </Segment>
      </Segment.Group>
      <SubmissionsViewJudgingRuns submission={submission} />
    </>
  ) : (
    <Spinner />
  );
});

export default SubmissionsView;
