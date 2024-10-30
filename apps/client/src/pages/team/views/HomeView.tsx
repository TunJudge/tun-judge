import { FC } from 'react';
import { Flex } from 'tw-react-components';

import { ProblemSet, Scoreboard } from '@core/components';

import { ClarificationsList } from './ClarificationsList';
import { SubmissionsList } from './SubmissionsList';

export const HomeView: FC = () => (
  <Flex className="mx-auto px-3 md:max-w-7xl" direction="column" align="center" fullWidth>
    <Scoreboard className="py-12" compact />
    <Flex fullWidth>
      <Flex className="gap-6" direction="column" fullWidth>
        <ProblemSet className="p-0" listMode />
        <ClarificationsList className="p-0" />
      </Flex>
      <Flex fullWidth>
        <SubmissionsList className="p-0" />
      </Flex>
    </Flex>
  </Flex>
);
