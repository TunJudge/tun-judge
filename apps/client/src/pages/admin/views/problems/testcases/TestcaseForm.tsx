import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { FileKind } from '@prisma/client';

import { useToastContext } from '@core/contexts';
import { uploadFile } from '@core/utils';
import { useUpsertTestcase } from '@models';

import { Problem } from '../ProblemView';
import { Testcase } from './TestcasesList';

type Props = {
  problem: Problem;
  testcase?: Partial<Testcase>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const TestcaseForm: FC<Props> = ({ problem, testcase, onSubmit, onClose }) => {
  const { toast } = useToastContext();

  const [inputFile, setInputFile] = useState<File>();
  const [outputFile, setOutputFile] = useState<File>();

  const form = useForm<Testcase>({ defaultValues: structuredClone(testcase) });

  const { mutateAsync } = useUpsertTestcase();

  useEffect(() => {
    form.reset(structuredClone(testcase));
  }, [form, testcase]);

  const handleSubmit = async ({ id = -1, inputFile: _, outputFile: __, ...testcase }: Testcase) => {
    try {
      if (inputFile) {
        const input = await uploadFile(inputFile, {
          name: `Problems/${problem.name}/Testcases/${inputFile.name}`,
          type: inputFile.type,
          size: inputFile.size,
          md5Sum: '',
          kind: FileKind.FILE,
          parentDirectoryName: `Problems/${problem.name}/Testcases`,
        });

        testcase.inputFileName = input.name;
      }

      if (outputFile) {
        const output = await uploadFile(outputFile, {
          name: `Problems/${problem.name}/Testcases/${outputFile.name}`,
          type: outputFile.type,
          size: outputFile.size,
          md5Sum: '',
          kind: FileKind.FILE,
          parentDirectoryName: `Problems/${problem.name}/Testcases`,
        });

        testcase.outputFileName = output.name;
      }

      const newTestcase = await mutateAsync({
        where: { id },
        create: testcase,
        update: testcase,
      });

      if (!newTestcase) return;

      toast('success', `Testcase ${newTestcase?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newTestcase?.id);
      onClose();
    } catch (error: unknown) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} testcase with error: ${(error as Error).message}`,
      );
    }
  };

  return (
    <FormDialog
      className="!max-w-xl"
      open={!!testcase}
      form={form}
      title={`${testcase?.id ? 'Update' : 'Create'} Testcase`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FormInputs.File
        name="inputFileName"
        label="Input File"
        placeholder="*.in"
        accept=".in"
        onFileChange={setInputFile}
        required
      />
      <FormInputs.Text name="inputFile.md5Sum" label="Input File MD5" disabled />
      <FormInputs.File
        name="outputFileName"
        label="Output File"
        placeholder="*.ans"
        accept=".ans"
        onFileChange={setOutputFile}
        required
      />
      <FormInputs.Text name="outputFile.md5Sum" label="Output File MD5" disabled />
      <FormInputs.Text name="description" label="Description" placeholder="Description" />
    </FormDialog>
  );
};
