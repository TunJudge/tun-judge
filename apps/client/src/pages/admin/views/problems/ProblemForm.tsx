import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import { FileKind, Problem } from '@core/prisma';
import { useFindManyExecutable, useUpsertProblem } from '@core/queries';
import { uploadFile } from '@core/utils';

type Props = {
  problem?: Partial<Problem>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const ProblemForm: FC<Props> = ({ problem, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const [statementFile, setStatementFile] = useState<File>();

  const form = useForm<Problem>({ defaultValues: structuredClone(problem) });

  const { data: executables = [] } = useFindManyExecutable();
  const { mutateAsync } = useUpsertProblem();

  const runners = executables.filter((e) => e.type === 'RUNNER');
  const checkers = executables.filter((e) => e.type === 'CHECKER');

  useEffect(() => {
    form.reset(structuredClone(problem));
  }, [form, problem]);

  useEffect(() => {
    if (!form.getValues('runScriptId')) {
      const defaultRunner = runners.find((e) => e.default);
      if (defaultRunner) form.setValue('runScriptId', defaultRunner.id);
    }

    if (!form.getValues('checkScriptId')) {
      const defaultChecker = checkers.find((e) => e.default);
      if (defaultChecker) form.setValue('checkScriptId', defaultChecker.id);
    }
  }, [problem, runners, checkers, form]);

  const handleSubmit = async ({ id = -1, ...problem }: Problem) => {
    try {
      if (statementFile) {
        const statement = await uploadFile(statementFile, {
          name: `Problems/${problem.name}/${statementFile.name}`,
          type: statementFile.type,
          size: statementFile.size,
          md5Sum: '',
          kind: FileKind.FILE,
          parentDirectoryName: `Problems/${problem.name}`,
        });

        problem.statementFileName = statement.name;
      }

      const newProblem = await mutateAsync({
        where: { id },
        create: problem,
        update: problem,
      });

      if (!newProblem) return;

      toast('success', `Problem ${newProblem?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newProblem?.id);
      onClose();
    } catch (error: unknown) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} problem with error: ${(error as Error).message}`,
      );
    }
  };

  return (
    <FormDialog
      className="!max-w-xl"
      open={!!problem}
      form={form}
      title={`${problem?.id ? 'Update' : 'Create'} Problem`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FormInputs.Text name="name" label="Name" placeholder="Name" autoComplete="off" required />
      <FormInputs.File
        name="statementFileName"
        label="Problem Statement File"
        placeholder="Problem Statement File"
        accept="application/pdf, text/html"
        onFileChange={setStatementFile}
        required
      />
      <FormInputs.Number
        name="timeLimit"
        label="Time Limit (Seconds)"
        placeholder="Time Limit"
        required
        unit="S"
        min={0}
        step={0.1}
      />
      <FormInputs.Number
        name="memoryLimit"
        label="Memory Limit (Kb)"
        placeholder="Memory Limit (Kb)"
        unit="Kb"
        min={0}
      />
      <FormInputs.Number
        name="outputLimit"
        label="Output Limit (Kb)"
        placeholder="Output Limit (Kb)"
        unit="Kb"
        min={0}
      />
      <FormInputs.Select
        name="runScriptId"
        label="Run Script"
        placeholder="Run Script"
        description="Submissions runner"
        items={runners.map((runner) => ({
          id: runner.id,
          label: runner.name,
          value: runner.id,
        }))}
        required
      />
      <FormInputs.Select
        name="checkScriptId"
        label="Check Script"
        placeholder="Check Script"
        description="Submissions output checker"
        items={checkers.map((runner) => ({
          id: runner.id,
          label: runner.name,
          value: runner.id,
        }))}
        required
      />
    </FormDialog>
  );
};
