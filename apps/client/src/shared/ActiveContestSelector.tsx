import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';

import { formatRestTime, getContestTimeProgress } from '@core/helpers';
import { Contest } from '@core/models';
import { PublicStore, useStore } from '@core/stores';

let interval: NodeJS.Timeout | undefined = undefined;

type Props = {
  className?: string;
};

const ActiveContestSelector: React.FC<Props> = observer(({ className }) => {
  const { setCurrentContest, contests, currentContest } = useStore<PublicStore>('publicStore');

  return (
    <Menu as="div" className="relative select-none" test-id="active-contest-selector">
      <Menu.Button
        className={classNames('flex cursor-pointer items-center justify-center gap-1', className)}
      >
        {currentContest?.shortName ?? 'No Active Contests'}
        <ChevronDownIcon className="h-4 w-4" />
        {currentContest && <ContestLeftTime contest={currentContest} />}
      </Menu.Button>
      <Menu.Items className="absolute left-1/2 z-50 mt-4 w-36 -translate-x-1/2 transform rounded-md border bg-white font-normal text-black shadow-lg outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        <Menu.Item>
          <div className="flex cursor-none items-center rounded-t-md bg-gray-300 px-3 py-2 dark:bg-gray-700">
            Change Contest
          </div>
        </Menu.Item>
        {contests.map((contest) => (
          <Menu.Item key={contest.id}>
            <div
              className={classNames(
                'm-1 flex cursor-pointer items-center rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700',
                {
                  'bg-gray-200 dark:bg-gray-700': contest.id === currentContest?.id,
                },
              )}
              onClick={() => setCurrentContest(contest.id)}
            >
              {contest.shortName}
            </div>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
});

const ContestLeftTime: React.FC<{ contest: Contest }> = ({ contest }) => {
  const [restTime, setRestTime] = useState<number>(0);
  const [contestStarted, setContestStarted] = useState<boolean>(true);
  const [contestTimeProgress, setContestTimeProgress] = useState<number>(0);
  const formattedRestTime = useMemo<string>(() => formatRestTime(restTime), [restTime]);

  const updateRestTime = (contest: Contest): void => {
    const startTime = new Date(contest.startTime).getTime();
    const endTime = new Date(contest.endTime).getTime();
    const now = Date.now();
    setContestStarted(now >= startTime);
    setRestTime((now < startTime ? startTime - now : endTime - now) / 1000);
    setContestTimeProgress(getContestTimeProgress(contest));
  };

  useEffect(() => {
    updateRestTime(contest);
    interval && clearInterval(interval);
    interval = setInterval(() => updateRestTime(contest), 1000);
    return () => {
      interval && clearInterval(interval);
    };
  }, [contest]);

  const color = contestTimeProgress === 100 ? '#059669' : '#2185d0';

  return (
    <div
      className="ml-2 rounded-md p-1 px-2"
      style={{
        background: `linear-gradient(to right, ${color} ${contestTimeProgress}%, rgba(33, 133, 208, .2) ${contestTimeProgress}%)`,
      }}
    >
      {!contestStarted && '- '}
      {formattedRestTime}
    </div>
  );
};

export default ActiveContestSelector;
