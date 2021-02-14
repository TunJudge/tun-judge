import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { Message, Segment } from 'semantic-ui-react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import './ChatBoxMessageList.scss';

const style: CSSProperties = {
  height: '40vh',
  overflowY: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
};

const ChatBoxMessageList: React.FC<{ clarification: Clarification }> = observer(
  ({ clarification }) => {
    const { profile } = rootStore;

    return (
      <Segment style={style}>
        {clarification.messages.map((message, index) => (
          <div
            key={index}
            style={{
              right: 0,
              width: '100%',
              textAlign: message.sentBy?.role.name === profile?.role.name ? 'right' : 'left',
            }}
          >
            <Message compact style={{ marginBottom: '.3rem' }}>
              {message.content}
            </Message>
          </div>
        ))}
      </Segment>
    );
  },
);

export default ChatBoxMessageList;
