import React from 'react';
import { Button, Dimmer, Loader, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { JudgingRun } from '../../../../core/models/judging-run.model';
import { rootStore } from '../../../../core/stores/RootStore';

const RunContentView: React.FC<{
  run: JudgingRun;
  dismiss: () => void;
}> = observer(({ run, dismiss }) => {
  if (run.id && !run.runOutput.content) {
    rootStore.submissionsStore
      .fetchRunContent(run.id)
      .then((content) => (run.runOutput.content = content));
  }
  return (
    <Modal open onClose={dismiss} size="mini">
      <Modal.Header>Team output</Modal.Header>
      <Modal.Content>
        {!run.runOutput.content ? (
          <Dimmer active inverted>
            <Loader inline="centered" />
          </Dimmer>
        ) : (
          <pre
            style={{
              margin: 0,
              maxHeight: '300px',
              overflow: 'auto',
              padding: '0.3rem',
              border: '0.5px grey solid',
              borderRadius: '.28571429rem',
            }}
          >
            <code>{atob(run.runOutput?.content?.payload ?? '')}</code>
          </pre>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss} size="mini">
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default RunContentView;
