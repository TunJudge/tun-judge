import { CloudUploadIcon } from '@heroicons/react/outline';
import { MD5 } from 'crypto-js';
import { observer } from 'mobx-react';
import React, { useRef } from 'react';

import { fileToBase64 } from '@core/helpers';
import { File as DbFile, FileContent, Problem } from '@core/models';
import { TestcasesStore, useStore } from '@core/stores';

type TestcaseBulkUploaderProps = {
  problem: Problem;
};

const TestcaseBulkUploader: React.FC<TestcaseBulkUploaderProps> = observer(({ problem }) => {
  const { create, data } = useStore<TestcasesStore>('testcasesStore');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div onClick={() => fileInputRef.current?.click()}>
      <CloudUploadIcon className="h-10 w-10 cursor-pointer rounded-md bg-green-500 p-2 hover:bg-green-400" />
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
    </div>
  );
});

export default TestcaseBulkUploader;
