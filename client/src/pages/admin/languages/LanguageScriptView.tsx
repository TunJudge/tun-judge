import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Language } from '../../../core/models';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import { MD5 } from 'crypto-js';

const LanguageScriptView: React.FC<{
  open: boolean;
  language: Language;
  field: 'buildScript' | 'runScript';
  dismiss: () => void;
  submit: () => void;
}> = observer(({ open, language, field, dismiss, submit }) => {
  return (
    <Modal open={open} onClose={dismiss}>
      <Modal.Header>Language {field} file content</Modal.Header>
      <Modal.Content>
        <AceEditor
          mode="sh"
          theme="tomorrow_night"
          value={atob(language[field]?.content?.payload ?? '')}
          width="100%"
          onChange={(value) => {
            const payload = btoa(value);
            language[field].size = value.length;
            language[field].md5Sum = MD5(payload).toString();
            language[field].content.payload = payload;
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

export default LanguageScriptView;
