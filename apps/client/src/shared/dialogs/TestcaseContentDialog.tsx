import { observer } from 'mobx-react';
import React from 'react';

import { Testcase } from '@core/models';
import { TestcasesStore, useStore } from '@core/stores';

import CodeEditor from '../CodeEditor';
import Spinner from '../Spinner';
import { SimpleDialog } from './SimpleDialog';

export const TestcaseContentDialog: React.FC<{
  testcase?: Testcase;
  field: 'input' | 'output';
  onClose: () => void;
}> = observer(({ testcase, field, onClose }) => {
  if (testcase?.id && !testcase[field]?.content) {
    useStore<TestcasesStore>('testcasesStore')
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
      {!testcase?.[field]?.content ? (
        <Spinner />
      ) : (
        <CodeEditor value={atob(testcase[field].content.payload ?? '')} readOnly />
      )}
    </SimpleDialog>
  );
});
