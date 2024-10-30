import { FC } from 'react';
import { Flex, cn } from 'tw-react-components';

import { useAuthContext } from '@core/contexts';
import { compareRoles } from '@core/utils';

import { Clarification } from './ChatBox';

type Props = {
  clarification?: Clarification;
};

export const ChatBoxMessageList: FC<Props> = ({ clarification }) => {
  const { profile } = useAuthContext();

  if (!profile) return null;

  return (
    <Flex
      className="border-border overflow-y-auto rounded-lg border p-3 dark:bg-slate-800"
      direction="column"
      fullHeight
      fullWidth
    >
      {clarification?.messages.map((message, index) => (
        <Flex
          key={index}
          className="gap-1"
          direction="column"
          align={compareRoles(profile, message.sentBy) ? 'end' : 'start'}
          fullWidth
        >
          <span
            className={cn('max-w-max rounded-2xl p-3 px-4', {
              'bg-gray-100 dark:bg-gray-900': compareRoles(profile, message.sentBy),
              'bg-gray-300 dark:bg-gray-700': !compareRoles(profile, message.sentBy),
            })}
            ref={(el) =>
              index === clarification.messages.length - 1 &&
              setTimeout(() => el?.scrollIntoView(), 10)
            }
          >
            {message.content}
          </span>
          <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
            Sent - by {message.sentBy.username}
          </span>
        </Flex>
      ))}
    </Flex>
  );
};
