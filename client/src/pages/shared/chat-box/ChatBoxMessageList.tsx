import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';

type Props = { clarification: Clarification };

const ChatBoxMessageList: React.FC<Props> = observer(({ clarification }) => {
  const { profile } = rootStore;

  return (
    <div className="flex flex-col gap-2 p-2 h-96 overflow-y-auto border border-gray-200 rounded-lg dark:border-gray-700">
      {clarification.messages.map((message, index) => (
        <div key={index}>
          <div
            className={classNames('p-3 border border-gray-300 rounded-md w-min', {
              'float-right bg-gray-100 dark:bg-gray-900 dark:border-gray-700':
                message.sentBy?.role.name === profile?.role.name,
              'float-left bg-gray-300 dark:bg-gray-700 dark:border-gray-800':
                message.sentBy?.role.name !== profile?.role.name,
            })}
            ref={(el) => setTimeout(() => el?.scrollIntoView(), 10)}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChatBoxMessageList;
