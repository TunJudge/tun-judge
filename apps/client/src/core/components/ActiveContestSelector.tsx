import { ChevronDownIcon } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { Button, DropdownMenu, cn } from 'tw-react-components';

import { formatRestTime, getContestTimeProgress } from '@core/utils';

import { Contest, useActiveContest } from '../contexts';

type Props = {
  className?: string;
};

export const ActiveContestSelector: FC<Props> = ({ className }) => {
  const { activeContests, currentContest, setCurrentContest } = useActiveContest();

  return (
    <DropdownMenu test-id="active-contest-selector">
      <DropdownMenu.Trigger asChild>
        <Button
          className={cn(
            'bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-900',
            className,
          )}
          suffixIcon={ChevronDownIcon}
        >
          {currentContest?.shortName ?? (
            <span className="text-slate-700 dark:text-slate-500">No Active Contests</span>
          )}
          {currentContest && <ContestLeftTime contest={currentContest} />}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-56">
        <DropdownMenu.Item disabled>Change Contest</DropdownMenu.Item>
        <DropdownMenu.RadioGroup
          value={`${currentContest?.id}`}
          onChange={(id) => setCurrentContest(activeContests.find((contest) => contest.id === +id))}
        >
          {activeContests.map((contest) => (
            <DropdownMenu.RadioItem key={contest.id} value={`${contest.id}`}>
              {contest.name}
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const ContestLeftTime: FC<{ contest: Contest }> = ({ contest }) => {
  const [restTime, setRestTime] = useState(0);
  const [contestStarted, setContestStarted] = useState(true);
  const [contestTimeProgress, setContestTimeProgress] = useState(0);
  const formattedRestTime = useMemo(() => formatRestTime(restTime), [restTime]);

  const updateRestTime = (contest: Contest): void => {
    const startTime = new Date(contest.startTime).getTime();
    const endTime = new Date(contest.endTime ?? contest.startTime).getTime();
    const now = Date.now();
    setContestStarted(now >= startTime);
    setRestTime((now < startTime ? startTime - now : endTime - now) / 1000);
    setContestTimeProgress(getContestTimeProgress(contest));
  };

  useEffect(() => {
    updateRestTime(contest);
    const interval = setInterval(() => updateRestTime(contest), 1000);

    return () => clearInterval(interval);
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
