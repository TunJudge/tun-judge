import {
  CheckCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/outline';
import { NoActiveContest } from '@shared/NoActiveContest';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';

import { getDisplayDate } from '@core/helpers';
import { Contest } from '@core/models';
import { ContestsStore, PublicStore, useStore } from '@core/stores';

const Dashboard: React.FC = observer(() => {
  const { update } = useStore<ContestsStore>('contestsStore');
  const {
    currentContest,
    totalSubmissions,
    totalPendingSubmissions,
    totalWrongSubmissions,
    totalCorrectSubmissions,
    isCurrentContestActive,
    isCurrentContestStarted,
    isCurrentContestFrozen,
    isCurrentContestOver,
    isCurrentContestUnfrozen,
  } = useStore<PublicStore>('publicStore');

  const setFieldAsNow = async (contest: Contest, timeField: keyof Contest): Promise<void> => {
    contest[timeField] = new Date() as never;
    await update(contest);
  };

  const controlActions: {
    Icon: React.FC<{ className?: string }>;
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
      completed: isCurrentContestActive,
      disabled: isCurrentContestActive,
      onClick: (contest) => () => setFieldAsNow(contest, 'activateTime'),
    },
    {
      Icon: PlayIcon,
      action: 'Start',
      time: (contest) => contest.startTime,
      completed: isCurrentContestStarted,
      disabled: isCurrentContestStarted,
      onClick: (contest) => () => setFieldAsNow(contest, 'startTime'),
    },
    {
      Icon: EyeOffIcon,
      action: 'Freeze',
      time: (contest) => contest.freezeTime ?? contest.endTime,
      completed: isCurrentContestFrozen || isCurrentContestOver,
      disabled: isCurrentContestFrozen || isCurrentContestOver || !isCurrentContestStarted,
      onClick: (contest) => () => setFieldAsNow(contest, 'freezeTime'),
    },
    {
      Icon: StopIcon,
      action: 'Stop',
      time: (contest) => contest.endTime,
      completed: isCurrentContestOver,
      disabled: isCurrentContestOver || !isCurrentContestStarted,
      onClick: (contest) => () => setFieldAsNow(contest, 'endTime'),
    },
    {
      Icon: EyeIcon,
      action: 'Unfreeze',
      time: (contest) => contest.unfreezeTime ?? contest.endTime,
      completed: isCurrentContestUnfrozen,
      disabled: isCurrentContestUnfrozen || !isCurrentContestFrozen,
      onClick: (contest) => () => setFieldAsNow(contest, 'unfreezeTime'),
    },
  ];

  return !currentContest ? (
    <NoActiveContest />
  ) : (
    <div className="mx-auto space-y-4 overflow-auto p-4 xl:container dark:text-white">
      <div className="flex items-center justify-center rounded-md bg-white p-2 shadow dark:bg-slate-800">
        <div className="text-4xl font-medium">
          {currentContest ? currentContest.name : 'No Active Contest'}
        </div>
      </div>
      <div className="divide-y rounded-md bg-white shadow dark:divide-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-center p-2">
          <div className="text-2xl">Submissions Statistics</div>
        </div>
        <div className="grid grid-cols-2 text-center sm:grid-cols-4">
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium">{totalSubmissions}</div>
            <div className="text-md font-medium uppercase">Total</div>
          </div>
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium text-yellow-600">{totalPendingSubmissions}</div>
            <div className="text-md font-medium uppercase">Pending</div>
          </div>
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium text-red-600">{totalWrongSubmissions}</div>
            <div className="text-md font-medium uppercase">Wrong</div>
          </div>
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium text-green-600">{totalCorrectSubmissions}</div>
            <div className="text-md font-medium uppercase">Correct</div>
          </div>
        </div>
      </div>
      <div className="divide-y overflow-hidden rounded-md bg-white shadow dark:divide-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-center p-2">
          <div className="text-2xl">Control Contest</div>
        </div>
        <div className="grid grid-cols-2 divide-x text-center sm:grid-cols-5 dark:divide-slate-700">
          {controlActions.map(({ Icon, action, time, onClick, disabled, completed }, index) => (
            <div
              key={index}
              className={classNames('flex select-none items-center p-4 sm:col-auto', {
                'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700': !disabled,
                'bg-slate-50 text-slate-400 dark:bg-slate-600': disabled,
                'col-span-2': index === controlActions.length - 1,
              })}
              onClick={disabled || completed ? undefined : onClick(currentContest)}
            >
              {completed ? (
                <CheckCircleIcon className="ml-4 mr-2 h-16 w-16 text-green-600" />
              ) : (
                <Icon className="ml-4 mr-2 h-16 w-16" />
              )}
              <div className="flex w-full flex-col space-y-1">
                <div className="text-lg font-medium">{action}</div>
                <div>{getDisplayDate(time(currentContest))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
