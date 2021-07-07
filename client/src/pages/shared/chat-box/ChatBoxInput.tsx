import { PaperAirplaneIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Clarification, ClarificationMessage } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';

const ChatBoxInput: React.FC<{ clarification: Clarification }> = observer(({ clarification }) => {
  const [message, setMessage] = useState<string>('');
  const {
    profile,
    publicStore: { currentContest },
    clarificationsStore: { sendClarification },
  } = rootStore;

  const onSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    clarification.messages.push({ content: message, sentBy: profile } as ClarificationMessage);
    setMessage('');
    await sendClarification(currentContest!.id, clarification);
  };

  return (
    <div>
      <form className="flex gap-2" onSubmit={onSubmit}>
        <textarea
          className="p-2 border border-gray-200 rounded-lg w-full"
          value={message}
          placeholder="Write a reply..."
          onChange={({ target: { value } }) => setMessage(value)}
        />
        <button type="submit" className="p-2 px-6 bg-blue-600 rounded-lg">
          <PaperAirplaneIcon className="text-white h-8 w-8" />
        </button>
      </form>
    </div>
  );
});

export default ChatBoxInput;
