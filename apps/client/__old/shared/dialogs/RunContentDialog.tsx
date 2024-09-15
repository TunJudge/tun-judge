import { observer } from 'mobx-react';
import React from 'react';

import { JudgingRun } from '@core/models';
import { SubmissionsStore, useStore } from '@core/stores';

import CodeEditor from '../CodeEditor';
import Spinner from '../Spinner';
import { SimpleDialog } from './SimpleDialog';

export const RunContentDialog: React.FC<{
  run?: JudgingRun;
  onClose: () => void;
}> = observer(({ run, onClose }) => {
  if (run?.id && !run.runOutput.content) {
    useStore<SubmissionsStore>('submissionsStore')
      .fetchRunContent(run.id)
      .then((content) => (run.runOutput.content = content));
  }
  return (
    <SimpleDialog title="Team output" isOpen={!!run} onClose={onClose} size="2xl">
      {!run?.runOutput?.content ? (
        <Spinner />
      ) : (
        <CodeEditor value={atob(run.runOutput.content.payload ?? '')} readOnly />
      )}
    </SimpleDialog>
  );
});
