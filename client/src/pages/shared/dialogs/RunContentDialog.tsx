import { observer } from 'mobx-react';
import React from 'react';
import { JudgingRun } from '../../../core/models/judging-run.model';
import { rootStore } from '../../../core/stores/RootStore';
import CodeEditor from '../CodeEditor';
import Spinner from '../Spinner';
import { SimpleDialog } from './SimpleDialog';

export const RunContentDialog: React.FC<{
  run?: JudgingRun;
  onClose: () => void;
}> = observer(({ run, onClose }) => {
  if (run?.id && !run.runOutput.content) {
    rootStore.submissionsStore
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
