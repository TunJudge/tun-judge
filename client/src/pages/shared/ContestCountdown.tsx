import React from 'react';
import { formatRestTime } from '../../core/helpers';

const ContestCountdown: React.FC<{ leftTime: number }> = ({ leftTime }) => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <div className="text-4xl pb-3">Contest starts after</div>
    <div className="text-9xl font-medium">-{formatRestTime(leftTime)}</div>
  </div>
);

export default ContestCountdown;
