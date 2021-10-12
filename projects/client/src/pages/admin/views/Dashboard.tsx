import {
  CheckCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { getDisplayDate } from '../../../core/helpers';
import { Contest } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { NoActiveContest } from '../../shared/NoActiveContest';

const Dashboard: React.FC = observer(() => {
  const {
    publicStore: {
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
    },
    contestsStore: { update },
  } = rootStore;

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
    <div className="p-4 xl:container mx-auto space-y-4 dark:text-white overflow-auto">
      <div className="flex items-center justify-center p-2 bg-white rounded-md shadow dark:bg-gray-800">
        <div className="text-4xl font-medium">
          {currentContest ? currentContest.name : 'No Active Contest'}
        </div>
      </div>
      <div className="divide-y rounded-md bg-white shadow dark:bg-gray-800 dark:divide-gray-700">
        <div className="flex items-center justify-center p-2">
          <div className="text-2xl">Submissions Statistics</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 text-center">
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium">{totalSubmissions}</div>
            <div className="text-md uppercase font-medium">Total</div>
          </div>
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium text-yellow-600">{totalPendingSubmissions}</div>
            <div className="text-md uppercase font-medium">Pending</div>
          </div>
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium text-red-600">{totalWrongSubmissions}</div>
            <div className="text-md uppercase font-medium">Wrong</div>
          </div>
          <div className="flex flex-col space-y-1 py-4">
            <div className="text-6xl font-medium text-green-600">{totalCorrectSubmissions}</div>
            <div className="text-md uppercase font-medium">Correct</div>
          </div>
        </div>
      </div>
      <div className="divide-y rounded-md bg-white shadow dark:bg-gray-800 dark:divide-gray-700 overflow-hidden">
        <div className="flex items-center justify-center p-2">
          <div className="text-2xl">Control Contest</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 text-center divide-x dark:divide-gray-700">
          {controlActions.map(({ Icon, action, time, onClick, disabled, completed }, index) => (
            <div
              key={index}
              className={classNames('flex items-center sm:col-auto select-none p-4', {
                'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700': !disabled,
                'text-gray-400 bg-gray-50 dark:bg-gray-600': disabled,
                'col-span-2': index === controlActions.length - 1,
              })}
              onClick={disabled || completed ? undefined : onClick(currentContest)}
            >
              {completed ? (
                <CheckCircleIcon className="h-16 w-16 ml-4 mr-2 text-green-600" />
              ) : (
                <Icon className="h-16 w-16 ml-4 mr-2" />
              )}
              <div className="flex flex-col space-y-1 w-full">
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
