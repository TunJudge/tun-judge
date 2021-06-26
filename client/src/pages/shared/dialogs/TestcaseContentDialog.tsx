import { observer } from 'mobx-react';
import React from 'react';
import { Testcase } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import CodeEditor from '../CodeEditor';
import { SimpleDialog } from './SimpleDialog';

export const TestcaseContentDialog: React.FC<{
  testcase?: Testcase;
  field: 'input' | 'output';
  onClose: () => void;
}> = observer(({ testcase, field, onClose }) => {
  if (testcase?.id && !testcase[field]?.content) {
    rootStore.testcasesStore
      .fetchContent(testcase.id, field as any)
      .then((content) => (testcase[field].content = content));
  }

  return (
    <SimpleDialog
      title={`Testcase ${testcase?.rank} ${field}`}
      isOpen={!!testcase}
      onClose={onClose}
      size="2xl"
    >
      <CodeEditor value={atob(testcase?.[field]?.content?.payload ?? '')} readOnly />
    </SimpleDialog>
  );
});
