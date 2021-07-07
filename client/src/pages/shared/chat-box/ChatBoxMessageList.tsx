import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { Clarification } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import './ChatBoxMessageList.scss';

type Props = { clarification: Clarification };

const ChatBoxMessageList: React.FC<Props> = observer(({ clarification }) => {
  const { profile } = rootStore;

  return (
    <div className="flex flex-col gap-2 p-2 h-96 overflow-y-auto border border-gray-200 rounded-lg">
      {clarification.messages.map((message, index) => (
        <div key={index}>
          <div
            className={classNames('p-3 bg-gray-100 border border-gray-300 rounded-md w-min', {
              'float-right': message.sentBy?.role.name === profile?.role.name,
              'float-left': message.sentBy?.role.name !== profile?.role.name,
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
