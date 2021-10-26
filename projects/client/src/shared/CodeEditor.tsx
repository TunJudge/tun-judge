import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-scala';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-monokai';

export type CodeEditorLanguages =
  | 'sh'
  | 'text'
  | 'c_cpp'
  | 'csharp'
  | 'java'
  | 'kotlin'
  | 'scala'
  | 'javascript'
  | 'typescript'
  | 'python';

type CodeEditorProps = {
  lang?: CodeEditorLanguages;
  value: string;
  readOnly?: boolean;
  showGutter?: boolean;
  onChange?: (value: string) => void;
};

const CodeEditor: React.FC<CodeEditorProps> = ({ lang, value, readOnly, showGutter, onChange }) => {
  return (
    <AceEditor
      style={{
        border: '0.5px grey solid',
        borderRadius: '.28571429rem',
      }}
      mode={lang ?? 'text'}
      theme="monokai"
      value={value}
      width="100%"
      onChange={onChange}
      readOnly={readOnly}
      showGutter={showGutter}
      showPrintMargin={false}
    />
  );
};

export default CodeEditor;
