import {
  CheckCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  PlayIcon,
  SquareIcon,
} from 'lucide-react';
import { FC, useMemo } from 'react';
import { Block, Flex, cn } from 'tw-react-components';

import { NoActiveContest } from '@core/components';
import { Contest, useActiveContest } from '@core/contexts';
import { useUpdateContest } from '@core/queries';
import { getDisplayDate } from '@core/utils';

export const Dashboard: FC = () => {
  const { currentContest } = useActiveContest();

  const { mutateAsync: updateContest } = useUpdateContest();

  const totalSubmissions = useMemo(
    () =>
      currentContest?.scoreCaches.reduce(
        (acc, scoreCache) => acc + scoreCache.restrictedSubmissions + scoreCache.restrictedPending,
        0,
      ) ?? 0,
    [currentContest],
  );
  const totalPendingSubmissions = useMemo(
    () =>
      currentContest?.scoreCaches.reduce(
        (acc, scoreCache) => acc + scoreCache.restrictedPending,
        0,
      ) ?? 0,
    [currentContest],
  );
  const totalCorrectSubmissions = useMemo(
    () =>
      currentContest?.scoreCaches.filter((scoreCache) => scoreCache.restrictedCorrect).length ?? 0,
    [currentContest],
  );
  const totalWrongSubmissions =
    totalSubmissions - totalCorrectSubmissions - totalPendingSubmissions;
  const currentContestStatus = useMemo(
    () => ({
      isActive: !!currentContest && Date.now() >= new Date(currentContest.activateTime).getTime(),
      isStarted: !!currentContest && Date.now() >= new Date(currentContest.startTime).getTime(),
      isFrozen:
        !!currentContest &&
        Date.now() >= new Date(currentContest.freezeTime ?? currentContest.endTime).getTime(),
      isOver: !!currentContest && Date.now() >= new Date(currentContest.endTime).getTime(),
      isUnfrozen:
        !!currentContest &&
        Date.now() >= new Date(currentContest.unfreezeTime ?? currentContest.endTime).getTime(),
    }),
    [currentContest],
  );

  const setFieldAsNow = async (contest: Contest, timeField: keyof Contest): Promise<void> => {
    updateContest({
      where: { id: contest.id },
      data: { [timeField]: new Date() },
    });
  };

  const controlActions: {
    Icon: FC<{ className?: string }>;
    action: string;
    time: (contest: Contest) => Date;
    completed: boolean;
    disabled: boolean;
    onClick: (contest: Contest) => () => void;
  }[] = [
    {
      Icon: CheckIcon,
      action: 'Activate',
      time: (contest) => contest.activateTime,
      completed: currentContestStatus.isActive,
      disabled: currentContestStatus.isActive,
      onClick: (contest) => () => setFieldAsNow(contest, 'activateTime'),
    },
    {
      Icon: PlayIcon,
      action: 'Start',
      time: (contest) => contest.startTime,
      completed: currentContestStatus.isStarted,
      disabled: currentContestStatus.isStarted,
      onClick: (contest) => () => setFieldAsNow(contest, 'startTime'),
    },
    {
      Icon: EyeOffIcon,
      action: 'Freeze',
      time: (contest) => contest.freezeTime ?? contest.endTime,
      completed: currentContestStatus.isFrozen || currentContestStatus.isOver,
      disabled:
        currentContestStatus.isFrozen ||
        currentContestStatus.isOver ||
        !currentContestStatus.isStarted,
      onClick: (contest) => () => setFieldAsNow(contest, 'freezeTime'),
    },
    {
      Icon: SquareIcon,
      action: 'Stop',
      time: (contest) => contest.endTime,
      completed: currentContestStatus.isOver,
      disabled: currentContestStatus.isOver || !currentContestStatus.isStarted,
      onClick: (contest) => () => setFieldAsNow(contest, 'endTime'),
    },
    {
      Icon: EyeIcon,
      action: 'Unfreeze',
      time: (contest) => contest.unfreezeTime ?? contest.endTime,
      completed: currentContestStatus.isUnfrozen,
      disabled: currentContestStatus.isUnfrozen || !currentContestStatus.isFrozen,
      onClick: (contest) => () => setFieldAsNow(contest, 'unfreezeTime'),
    },
  ];

  return !currentContest ? (
    <NoActiveContest />
  ) : (
    <Flex className="p-3" direction="column">
      <Flex className="p-6 text-4xl font-medium" align="center" justify="center" fullWidth>
        {currentContest ? currentContest.name : 'No Active Contest'}
      </Flex>
      <Flex
        className="border-border divide-border gap-0 divide-y rounded-md border"
        direction="column"
        fullWidth
      >
        <span className="w-full p-3 text-center text-2xl">Submissions Statistics</span>
        <Flex className="gap-0" fullWidth>
          {[
            ['Total', totalSubmissions],
            ['Pending', totalPendingSubmissions, 'text-yellow-600'],
            ['Wrong', totalWrongSubmissions, 'text-red-600'],
            ['Correct', totalCorrectSubmissions, 'text-green-600'],
          ].map(([label, value, className], index) => (
            <Flex key={index} className="gap-1 p-3" align="center" direction="column" fullWidth>
              <div className={cn('text-6xl font-medium', className)}>{value}</div>
              <div className="text-md font-medium uppercase">{label}</div>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex className="divide-border gap-0 divide-y rounded-md border" direction="column" fullWidth>
        <span className="w-full p-3 text-center text-2xl">Control Contest</span>
        <Block
          className="divide-border grid grid-cols-2 divide-x text-center md:grid-cols-5"
          fullWidth
        >
          {controlActions.map(({ Icon, action, time, onClick, disabled, completed }, index) => (
            <Flex
              key={index}
              className={cn('select-none p-3 md:col-auto', {
                'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700': !disabled,
                'bg-slate-50 text-slate-400 dark:bg-slate-600': disabled,
                'col-span-2': index === controlActions.length - 1,
              })}
              align="center"
              onClick={disabled || completed ? undefined : onClick(currentContest)}
            >
              {completed ? (
                <CheckCircleIcon className="ml-4 mr-2 h-16 w-16 text-green-600" />
              ) : (
                <Icon className="ml-4 mr-2 h-16 w-16" />
              )}
              <Flex className="gap-1" direction="column" align="center" fullWidth>
                <div className="text-lg font-medium">{action}</div>
                <div>{getDisplayDate(time(currentContest))}</div>
              </Flex>
            </Flex>
          ))}
        </Block>
      </Flex>
    </Flex>
  );
};
