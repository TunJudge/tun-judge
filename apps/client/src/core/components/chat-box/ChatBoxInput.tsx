import { SendIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, TextareaInput } from 'tw-react-components';

import { useActiveContest, useAuthContext } from '@core/contexts';
import { useCreateClarification, useCreateClarificationMessage } from '@core/queries';

import { Clarification } from './ChatBox';

type Props = {
  form: UseFormReturn<Clarification>;
  clarification?: Clarification;
};

export const ChatBoxInput: FC<Props> = ({ form, clarification }) => {
  const { profile } = useAuthContext();
  const { currentContest } = useActiveContest();

  const { mutateAsync: createClarification } = useCreateClarification();
  const { mutateAsync: createClarificationMessage } = useCreateClarificationMessage();

  const [message, setMessage] = useState<string>('');

  const isGeneral = clarification?.general ?? form.watch('general');
  const problem = currentContest?.problems.find(
    (p) => p.id === (clarification?.problemId ?? form.watch('problemId')),
  );

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profile || !currentContest) return;

    const clarificationId =
      clarification?.id ??
      (
        await createClarification({
          data: {
            general: form.watch('general'),
            problemId: form.getValues('problemId'),
            teamId: profile.teamId,
            contestId: currentContest.id,
          },
        })
      )?.id ??
      -1;

    await createClarificationMessage({
      data: {
        clarificationId,
        content: message,
        sentById: profile.id,
        sentTime: new Date(),
      },
    });

    setMessage('');
  };

  return (
    <form className="relative flex w-full gap-2 p-1" onSubmit={onSubmit}>
      <TextareaInput
        inputClassName="border-none"
        value={message}
        rows={4}
        placeholder="Write a reply..."
        onChange={({ target: { value } }) => setMessage(value)}
      />
      <Button
        className="absolute bottom-3 right-3"
        type="submit"
        color="blue"
        prefixIcon={SendIcon}
        disabled={(!isGeneral && !problem) || !message}
      >
        Send
      </Button>
    </form>
  );
};
