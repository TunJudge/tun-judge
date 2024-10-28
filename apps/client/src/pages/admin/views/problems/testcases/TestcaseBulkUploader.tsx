import { CloudUploadIcon } from 'lucide-react';
import { FC, useRef } from 'react';
import { Button } from 'tw-react-components';

import { FileKind } from '@prisma/client';

import { useCreateTestcase } from '@core/queries';
import { uploadFile } from '@core/utils';

import { Problem } from '../ProblemView';

type Props = {
  problem: Problem;
};

export const TestcaseBulkUploader: FC<Props> = ({ problem }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync } = useCreateTestcase();

  return (
    <Button
      color="green"
      prefixIcon={CloudUploadIcon}
      onClick={() => fileInputRef.current?.click()}
    >
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
                const uploadTestcaseFile = (file: File) =>
                  uploadFile(file, {
                    name: `Problems/${problem.name}/Testcases/${file.name}`,
                    type: file.type,
                    size: file.size,
                    md5Sum: '',
                    kind: FileKind.FILE,
                    parentDirectoryName: `Problems/${problem.name}/Testcases`,
                  });

                const inputFile = await uploadTestcaseFile(files.in);
                const outputFile = await uploadTestcaseFile(files.ans);

                if (
                  problem.testcases.some(
                    (testcase) =>
                      testcase.inputFile.md5Sum === inputFile.md5Sum &&
                      testcase.outputFile.md5Sum === outputFile.md5Sum,
                  )
                )
                  continue;
                await mutateAsync({
                  data: {
                    problemId: problem.id,
                    description: '-',
                    rank: problem.testcases.length,
                    inputFileName: inputFile.name,
                    outputFileName: outputFile.name,
                  },
                });
              }
            }
          }
        }}
      />
    </Button>
  );
};
