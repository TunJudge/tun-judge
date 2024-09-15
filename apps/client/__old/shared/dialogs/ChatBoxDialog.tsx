import { observer } from 'mobx-react';
import React from 'react';

import { Clarification } from '@core/models';

import ChatBox from '../chat-box/ChatBox';
import { DataTableItemForm } from '../data-table/DataTable';
import { SimpleDialog } from './index';

export const ChatBoxDialog: DataTableItemForm<Clarification> = observer(
  ({ item, isOpen, onClose, onSubmit }) => {
    return (
      <SimpleDialog bodyClassName="h-96" isOpen={isOpen} onClose={onClose} withoutFooter>
        <ChatBox item={item} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
      </SimpleDialog>
    );
  },
);
