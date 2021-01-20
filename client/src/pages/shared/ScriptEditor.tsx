import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { File } from '../../core/models';
import CodeEditor from './CodeEditor';
import { MD5 } from 'crypto-js';

const ScriptEditor: React.FC<{
  file: File;
  lang?: 'sh' | 'c_cpp';
  dismiss: () => void;
  submit?: () => void;
}> = observer(({ file, lang, dismiss, submit }) => {
  return (
    <Modal open onClose={dismiss}>
      <Modal.Header>Edit &#39;{file.name}&#39; script file</Modal.Header>
      <Modal.Content>
        <CodeEditor
          lang={lang ?? 'sh'}
          dark
          value={atob(file?.content?.payload ?? '')}
          onChange={(value) => {
            const payload = btoa(value);
            file.size = value.length;
            file.md5Sum = MD5(payload).toString();
            file.content.payload = payload;
          }}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Close
        </Button>
        {submit && (
          <Button color="green" onClick={submit}>
            Save
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
});

export default ScriptEditor;
