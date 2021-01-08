import React, { useRef } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { rootStore } from '../../../../core/stores/RootStore';
import { fileToBase64 } from '../../../../core/helpers';
import { MD5 } from 'crypto-js';
import { File as DbFile, FileContent, Problem } from '../../../../core/models';
import { observer } from 'mobx-react';

type TestcaseBulkUploaderProps = {
  problem: Problem;
};

const TestcaseBulkUploader: React.FC<TestcaseBulkUploaderProps> = observer(({ problem }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    testcasesStore: { create, data },
  } = rootStore;

  return (
    <Button color="green" icon className="mr-2" onClick={() => fileInputRef.current?.click()}>
      <Icon name="cloud upload" />
      <input
        ref={(ref) => (fileInputRef.current = ref)}
        type="file"
        hidden
        multiple
        accept=".in,.ans"
        onChange={async ({ target: { files } }) => {
          if (files) {
            const testcases: { [index: string]: { in: File; ans: File } } = {};
            Array.from(files).forEach((file) => {
              const match = /([0-9]+)\.(in|ans)$/g.exec(file.name);
              if (match !== null) {
                const [, index, type] = match;
                testcases[index] = {
                  ...testcases[index],
                  [type]: file,
                };
              }
            });
            for (const key in testcases) {
              const files = testcases[key];
              if (files.in && files.ans) {
                const inputPayload = await fileToBase64(files.in);
                const outputPayload = await fileToBase64(files.ans);
                const inputMD5Sum = MD5(inputPayload).toString();
                const outputMD5Sum = MD5(outputPayload).toString();
                if (
                  data.some(
                    ({ input, output }) =>
                      input.md5Sum === inputMD5Sum && output.md5Sum === outputMD5Sum,
                  )
                )
                  continue;
                await create({
                  input: {
                    name: files.in.name,
                    type: files.in.type,
                    size: files.in.size,
                    md5Sum: inputMD5Sum,
                    content: {
                      payload: inputPayload,
                    } as FileContent,
                  } as DbFile,
                  output: {
                    name: files.ans.name,
                    type: files.ans.type,
                    size: files.ans.size,
                    md5Sum: outputMD5Sum,
                    content: {
                      payload: outputPayload,
                    } as FileContent,
                  } as DbFile,
                  description: '-',
                  problem: problem,
                });
              }
            }
          }
        }}
      />
    </Button>
  );
});

export default TestcaseBulkUploader;
