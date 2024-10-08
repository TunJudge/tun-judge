import classNames from 'classnames';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';

import { compareRoles } from '@core/helpers';
import { Clarification } from '@core/models';
import { RootStore, useStore } from '@core/stores';

type Props = { clarification: Clarification };

const ChatBoxMessageList: React.FC<Props> = observer(({ clarification }) => {
  const { profile } = useStore<RootStore>('rootStore');

  return (
    <div className="flex h-full flex-col gap-1 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      {clarification.messages.map((message, index) => (
        <div key={index}>
          <div
            className={classNames('flex flex-col', {
              'float-right items-end': compareRoles(profile!, message.sentBy),
              'float-left': !compareRoles(profile!, message.sentBy),
            })}
          >
            <div
              className={classNames('max-w-max rounded-2xl p-3 px-4', {
                'bg-gray-100 dark:bg-gray-900': compareRoles(profile!, message.sentBy),
                'bg-gray-300 dark:bg-gray-700': !compareRoles(profile!, message.sentBy),
              })}
              ref={(el) => setTimeout(() => el?.scrollIntoView(), 10)}
            >
              {message.content}
            </div>
            <div className="px-2 text-sm text-gray-600 dark:text-gray-400">
              Sent {moment(message.sentTime).fromNow()} By {message.sentBy.username}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChatBoxMessageList;
