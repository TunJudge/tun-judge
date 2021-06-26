import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxInput from './ChatBoxInput';
import ChatBoxMessageList from './ChatBoxMessageList';

type ChatBoxProps = {
  item: Clarification;
  onClose: () => void;
  submit: (item: Clarification) => void;
};

const ChatBox: React.FC<ChatBoxProps> = observer(({ item: clarification, onClose }) => {
  const {
    clarificationsStore: { item, setItem },
  } = rootStore;

  useEffect(() => {
    setItem(clarification);
  }, [setItem, clarification]);

  return (
    <Modal open onClose={onClose}>
      <Segment.Group>
        <ChatBoxHeader clarification={item} />
        <ChatBoxMessageList clarification={item} />
        <ChatBoxInput clarification={item} />
      </Segment.Group>
    </Modal>
  );
});

export default ChatBox;
