import React from 'react';

import { formatRestTime } from '@core/helpers';

const ContestCountdown: React.FC<{ leftTime: number }> = ({ leftTime }) => (
  <div className="flex h-full w-full flex-col items-center justify-center dark:text-white">
    <div className="pb-3 text-4xl">Contest starts after</div>
    <div className="text-9xl font-medium">-{formatRestTime(leftTime)}</div>
  </div>
);

export default ContestCountdown;
