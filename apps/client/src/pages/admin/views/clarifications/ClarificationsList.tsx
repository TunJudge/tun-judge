import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from 'tw-react-components';

import { ChatBox } from '@core/components';

import { ClarificationsSidebar } from './ClarificationsSidebar';

export const ClarificationsList: FC = () => {
  const { clarificationId } = useParams();

  return (
    <Flex className="divide-border gap-0 divide-x" fullHeight fullWidth>
      <ClarificationsSidebar />
      {clarificationId ? (
        <ChatBox
          className="rounded-none border-0 border-l"
          clarificationId={clarificationId === 'new' ? undefined : parseInt(clarificationId)}
        />
      ) : (
        <Flex className="opacity-40" align="center" justify="center" fullHeight fullWidth>
          Click on a clarification to view its messages
        </Flex>
      )}
    </Flex>
  );
};
