import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { compareRoles } from '../../../core/helpers';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { DataTableItemForm } from '../data-table/DataTable';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxInput from './ChatBoxInput';
import ChatBoxMessageList from './ChatBoxMessageList';

const ChatBox: DataTableItemForm<Clarification> = observer(({ item: clarification }) => {
  const {
    isUserJury,
    profile,
    publicStore: { currentContest },
    clarificationsStore: {
      item,
      setItem,
      setClarificationMessageAsSeen,
      fetchAllForContest,
      fetchAllForTeam,
    },
  } = rootStore;

  useEffect(() => {
    setItem(clarification);
  }, [setItem, clarification]);

  useEffect(() => {
    if (currentContest) {
      Promise.all(
        item.messages.map(async (message) => {
          if (!compareRoles(profile!, message.sentBy) && !message.seen) {
            await setClarificationMessageAsSeen(currentContest.id, item.id, message.id);
            return true;
          }
          return false;
        })
      ).then<any>(
        (res) => res.some(Boolean) && isUserJury && fetchAllForContest(currentContest.id)
      );
    }
  }, [
    item,
    profile,
    isUserJury,
    currentContest,
    setClarificationMessageAsSeen,
    fetchAllForContest,
    fetchAllForTeam,
  ]);

  return (
    <div className="flex flex-col h-full gap-y-3 dark:text-white">
      <ChatBoxHeader clarification={item} />
      <ChatBoxMessageList clarification={item} />
      {(item.team || isUserJury) && <ChatBoxInput clarification={item} />}
    </div>
  );
});

export default ChatBox;
