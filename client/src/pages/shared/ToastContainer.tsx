import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/solid';
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
    <div className="fixed bottom-8 right-8 z-50 w-80">
      {toasts.map(({ type, message }, index) => {
        const Icon = icons[type];
        return (
          <div
            key={index}
            className={`grid grid-cols-6 gap-x-4 rounded-xl border border-${colors[type]}-500 shadow-lg bg-white p-4`}
          >
            <div className="flex items-center justify-center">
              <Icon className={`h-10 w-10 text-${colors[type]}-500`} />
            </div>
            <div className="col-span-5">{message}</div>
          </div>
        );
      })}
    </div>
  );
});

export default ToastContainer;
