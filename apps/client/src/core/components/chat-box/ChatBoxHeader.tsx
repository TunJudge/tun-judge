import { FC, useEffect } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { FormInputs, cn } from 'tw-react-components';

import { useActiveContest } from '@core/contexts';

import { Clarification } from './ChatBox';

type Props = {
  form: UseFormReturn<Clarification>;
  clarification?: Clarification;
};

export const ChatBoxHeader: FC<Props> = ({ form, clarification }) => {
  const { currentContest } = useActiveContest();

  const isGeneral = form.watch('general');
  const problem = currentContest?.problems.find((p) => p.id === form.watch('problemId'));

  useEffect(() => {
    if (isGeneral) {
      form.setValue('problemId', null);
    }
  }, [form, isGeneral]);

  return clarification?.id ? (
    <div className="p-3 text-2xl font-medium">
      {isGeneral ? 'General' : `${problem?.shortName} - ${problem?.problem.name}`}
    </div>
  ) : (
    <FormProvider {...form}>
      <form
        className={cn('grid w-full gap-2 p-3', {
          'grid-cols-1': isGeneral,
          'grid-cols-2': !isGeneral,
        })}
      >
        <FormInputs.Select
          name="general"
          items={[
            { id: 'general', label: 'General', value: true },
            { id: 'problem', label: 'Problem related', value: false },
          ]}
        />
        {!isGeneral && (
          <FormInputs.Select
            name="problemId"
            placeholder="Problem"
            items={(currentContest?.problems ?? []).map((p) => ({
              id: p.id,
              label: `${p.shortName} - ${p.problem.name}`,
              value: p.id,
            }))}
          />
        )}
      </form>
    </FormProvider>
  );
};
