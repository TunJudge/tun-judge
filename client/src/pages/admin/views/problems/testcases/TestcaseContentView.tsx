import { observer } from 'mobx-react';
import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { Testcase } from '../../../../../core/models';
import { rootStore } from '../../../../../core/stores/RootStore';

const TestcaseContentView: React.FC<{
  testcase: Testcase;
  field: 'input' | 'output';
  dismiss: () => void;
}> = observer(({ testcase, field, dismiss }) => {
  if (testcase.id && !testcase[field]?.content) {
    rootStore.testcasesStore
      .fetchContent(testcase.id, field as any)
      .then((content) => (testcase[field].content = content));
  }
  return (
    <Modal open onClose={dismiss} size="mini">
      <Modal.Header>
        Testcase {testcase.rank} {field}
      </Modal.Header>
      <Modal.Content>
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
          <code>{atob(testcase[field]?.content?.payload ?? '')}</code>
        </pre>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss} size="mini">
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default TestcaseContentView;
