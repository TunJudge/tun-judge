import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { File } from '../../core/models';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import { MD5 } from 'crypto-js';

const ScriptEditor: React.FC<{
  file: File;
  lang?: 'sh' | 'c_cpp';
  dismiss: () => void;
  submit: () => void;
}> = observer(({ file, lang, dismiss, submit }) => {
  return (
    <Modal open onClose={dismiss}>
      <Modal.Header>Edit &#39;{file.name}&#39; script file</Modal.Header>
      <Modal.Content>
        <AceEditor
          mode={lang ?? 'sh'}
          theme="tomorrow_night"
          value={atob(file?.content?.payload ?? '')}
          width="100%"
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
        <Button color="green" onClick={submit}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default ScriptEditor;
