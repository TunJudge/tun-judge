import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useMemo, useState } from 'react';
import { formatRestTime, getContestTimeProgress } from '../../core/helpers';
import { Contest } from '../../core/models';
import { rootStore } from '../../core/stores/RootStore';

let interval: NodeJS.Timeout | undefined = undefined;

type Props = {
  className?: string;
};

const ActiveContestSelector: React.FC<Props> = observer(({ className }) => {
  const { setCurrentContest, contests, currentContest } = rootStore.publicStore;

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
    if (currentContest) {
      updateRestTime(currentContest);
      interval && clearInterval(interval);
      interval = setInterval(() => updateRestTime(currentContest), 1000);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [currentContest]);

  const color = contestTimeProgress === 100 ? '#21ba45' : '#2185d0';

  return (
    <Menu as="div" className="relative select-none">
      <Menu.Button
        className={classNames('flex items-center justify-center gap-1 cursor-pointer', className)}
      >
        {currentContest?.shortName ?? 'No Active Contests'}
        <ChevronDownIcon className="w-4 h-4" />
        {currentContest && (
          <div
            className="ml-2 px-2 p-1 rounded-md"
            style={{
              background: `linear-gradient(to right, ${color} ${contestTimeProgress}%, rgba(33, 133, 208, .2) ${
                100 - contestTimeProgress
              }%)`,
            }}
          >
            {!contestStarted && '- '}
            {formattedRestTime}
          </div>
        )}
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white rounded-md shadow-lg outline-none text-gray-900 font-normal">
          <Menu.Item>
            <div className="flex items-center gap-1 px-3 py-2 cursor-none bg-gray-300 rounded-t-md">
              Change Contest
            </div>
          </Menu.Item>
          {contests.map((contest) => (
            <Menu.Item key={contest.id}>
              <div
                className="flex items-center px-3 py-2 cursor-pointer rounded-md m-1 hover:bg-gray-100"
                onClick={() => setCurrentContest(contest.id)}
              >
                {contest.shortName}
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
});

export default ActiveContestSelector;
