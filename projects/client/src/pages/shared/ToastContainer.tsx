import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/solid';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { rootStore } from '../../core/stores/RootStore';
import { ToastType } from '../../core/stores/ToastsStore';

const colors: Record<ToastType, string> = {
  info: 'gray',
  success: 'green',
  warn: 'yellow',
  error: 'red',
};

const icons: Record<ToastType, React.FC<{ className?: string }>> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warn: ExclamationCircleIcon,
  error: ExclamationCircleIcon,
};

const ToastContainer: React.FC = observer(() => {
  const { toasts } = rootStore.toastsStore;

  return (
    <div className="fixed bottom-8 right-8 z-50 w-80 flex flex-col gap-2">
      {toasts.map(({ type, message, testId }, index) => {
        const Icon = icons[type];
        return (
          <div
            key={index}
            className={classNames(
              `grid grid-cols-6 gap-x-4 rounded-xl border shadow-lg bg-white p-4 dark:bg-gray-800 dark:text-white`,
              {
                'border-gray-500': colors[type] === 'gray',
                'border-green-500': colors[type] === 'green',
                'border-yellow-500': colors[type] === 'yellow',
                'border-red-500': colors[type] === 'red',
              }
            )}
            test-id={testId}
          >
            <div className="flex items-center justify-center">
              <Icon
                className={classNames('h-10 w-10', {
                  'text-gray-500': colors[type] === 'gray',
                  'text-green-500': colors[type] === 'green',
                  'text-yellow-500': colors[type] === 'yellow',
                  'text-red-500': colors[type] === 'red',
                })}
              />
            </div>
            <div className="col-span-5 flex items-center">{message}</div>
          </div>
        );
      })}
    </div>
  );
});

export default ToastContainer;
