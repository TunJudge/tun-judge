import { FC } from 'react';
import { Flex } from 'tw-react-components';

import { formatRestTime } from '@core/utils';

export const ContestCountdown: FC<{ timeLeft: number }> = ({ timeLeft }) => (
  <Flex direction="column" align="center" justify="center" fullHeight fullWidth>
    <div className="pb-3 text-4xl">Contest starts after</div>
    <div className="text-9xl font-medium">-{formatRestTime(timeLeft)}</div>
  </Flex>
);
