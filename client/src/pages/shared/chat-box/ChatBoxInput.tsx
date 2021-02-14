import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Form, Input, Segment } from 'semantic-ui-react';
import { Clarification, ClarificationMessage } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';

const ChatBoxInput: React.FC<{ clarification: Clarification }> = observer(({ clarification }) => {
  const [message, setMessage] = useState<string>('');
  const {
    profile,
    publicStore: { currentContest },
    clarificationsStore: { sendClarification },
  } = rootStore;

  const onSubmit = async (): Promise<void> => {
    clarification.messages.push({ content: message, sentBy: profile } as ClarificationMessage);
    await sendClarification(currentContest!.id, clarification);
    setMessage('');
  };

  return (
    <Segment>
      <Form onSubmit={onSubmit}>
        <Input
          fluid
          required
          value={message}
          placeholder="Write a reply..."
          action={{ icon: 'send' }}
          onChange={(_, { value }) => setMessage(value)}
        />
      </Form>
    </Segment>
  );
});

export default ChatBoxInput;
