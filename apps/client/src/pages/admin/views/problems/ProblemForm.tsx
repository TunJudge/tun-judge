import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import { useFindManyExecutable, useUpsertProblem } from '@models';

import { Problem } from './ProblemsList';

type Props = {
  problem?: Partial<Problem>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const ProblemForm: FC<Props> = ({ problem, onClose, onSubmit }) => {
  const { toast } = useToastContext();

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

  const handleSubmit = async ({ id = -1, _count: _, ...problem }: Problem) => {
    try {
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
      className="!max-w-4xl"
      open={!!problem}
      form={form}
      title={`${problem?.id ? 'Update' : 'Create'} Problem`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Flex direction="column" fullWidth>
        <Flex fullWidth>
          <FormInputs.Text name="name" label="Name" placeholder="Name" required />
          {/* <FileInput
          entity={problem}
          field="file"
          label="Problem File"
          accept="application/pdf, text/html"
          required
          errors={errors}
          setErrors={setErrors}
        /> */}
        </Flex>
        <Flex fullWidth>
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
        </Flex>
        <Flex fullWidth>
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
        </Flex>
      </Flex>
    </FormDialog>
  );
};
