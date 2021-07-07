import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { DataTableItemForm } from '../data-table/DataTable';
import { SimpleDialog } from '../dialogs';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxInput from './ChatBoxInput';
import ChatBoxMessageList from './ChatBoxMessageList';

const ChatBox: DataTableItemForm<Clarification> = observer(
  ({ item: clarification, isOpen, onClose }) => {
    const {
      clarificationsStore: { item, setItem },
    } = rootStore;

    useEffect(() => {
      setItem(clarification);
    }, [setItem, clarification]);

    return (
      <SimpleDialog isOpen={isOpen} onClose={onClose} withoutFooter>
        <div className="flex flex-col gap-y-4">
          <ChatBoxHeader clarification={item} />
          <ChatBoxMessageList clarification={item} />
          <ChatBoxInput clarification={item} />
        </div>
      </SimpleDialog>
    );
  },
);

export default ChatBox;
