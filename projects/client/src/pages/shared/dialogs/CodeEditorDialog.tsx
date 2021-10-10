import { MD5 } from 'crypto-js';
import { observer } from 'mobx-react';
import React from 'react';
import { File } from '../../../core/models';
import CodeEditor from '../CodeEditor';
import { FormModal } from './FormDialog';

export const CodeEditorDialog: React.FC<{
  file?: File;
  readOnly: boolean;
  lang?: 'sh' | 'c_cpp';
  dismiss: () => void;
  submit: () => void;
}> = observer(({ file, readOnly, lang, dismiss, submit }) => {
  return (
    <FormModal
      title={`Edit '${file?.name}' script file`}
      isOpen={!!file}
      onClose={dismiss}
      onSubmit={readOnly ? undefined : submit}
    >
      <CodeEditor
        lang={lang ?? 'sh'}
        value={atob(file?.content?.payload ?? '')}
        readOnly={readOnly}
        onChange={(value) => {
          const payload = btoa(value);
          file!.size = value.length;
          file!.md5Sum = MD5(payload).toString();
          file!.content.payload = payload;
        }}
      />
    </FormModal>
  );
});
