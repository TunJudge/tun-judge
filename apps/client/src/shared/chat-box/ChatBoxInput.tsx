import { PaperAirplaneIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Clarification, ClarificationMessage } from '@core/models';
import { ClarificationsStore, PublicStore, RootStore, useStore } from '@core/stores';

const ChatBoxInput: React.FC<{ clarification: Clarification }> = observer(({ clarification }) => {
  const { profile } = useStore<RootStore>('rootStore');
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { sendClarification } = useStore<ClarificationsStore>('clarificationsStore');

  const [message, setMessage] = useState<string>('');

  const onSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    clarification.messages.push({ content: message, sentBy: profile } as ClarificationMessage);
    setMessage('');
    await sendClarification(currentContest!.id, clarification);
  };

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <textarea
        className="w-full rounded-lg border border-gray-200 p-2 dark:border-gray-700 dark:bg-gray-800"
        value={message}
        placeholder="Write a reply..."
        onChange={({ target: { value } }) => setMessage(value)}
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 p-2 px-6 hover:bg-blue-400 disabled:cursor-default disabled:opacity-50 dark:hover:bg-blue-900"
        disabled={(!clarification.general && !clarification.problem) || !message}
      >
        <PaperAirplaneIcon className="h-8 w-8 text-white" />
      </button>
    </form>
  );
});

export default ChatBoxInput;
