import { AlertCircleIcon, CheckCircleIcon, InfoIcon, XIcon } from 'lucide-react';
import { FC, PropsWithChildren, ReactNode, createContext, useState } from 'react';
import { cn } from 'tw-react-components';

const colors: Record<ToastType, string> = {
  info: 'gray',
  success: 'green',
  warn: 'yellow',
  error: 'red',
};

const icons: Record<ToastType, FC<{ className?: string }>> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warn: AlertCircleIcon,
  error: AlertCircleIcon,
};

type ToastType = 'info' | 'success' | 'warn' | 'error';

type Toast = {
  id: string;
  type: ToastType;
  message: ReactNode;
};

export type ToastContext = {
  toast: (type: ToastType, message: ReactNode, timeout?: number) => void;
};

export const ToastContext = createContext<ToastContext | undefined>(undefined);

export const ToastContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: string) => setToasts((toasts) => toasts.filter((toast) => toast.id !== id));

  const toast: ToastContext['toast'] = (type, message, timeout = 3000): void => {
    const id = Math.random().toString();
    setToasts((toasts) =>
      toasts.concat({
        id: id,
        type: type,
        message: message,
      }),
    );
    setTimeout(() => remove(id), timeout);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[1000] flex w-96 flex-col gap-2">
        {toasts.map(({ id, type, message }) => {
          const Icon = icons[type];

          return (
            <div
              key={id}
              className={cn(
                `relative flex gap-x-4 rounded-lg border bg-white p-4 py-6 shadow-lg dark:bg-slate-800 dark:text-white`,
                {
                  'border-slate-500': colors[type] === 'gray',
                  'border-green-500': colors[type] === 'green',
                  'border-yellow-500': colors[type] === 'yellow',
                  'border-red-500': colors[type] === 'red',
                },
              )}
            >
              <div className="flex items-center justify-center">
                <Icon
                  className={cn('h-10 w-10', {
                    'text-slate-500': colors[type] === 'gray',
                    'text-green-500': colors[type] === 'green',
                    'text-yellow-500': colors[type] === 'yellow',
                    'text-red-500': colors[type] === 'red',
                  })}
                />
              </div>
              <div className="flex items-center">{message}</div>
              <XIcon
                className="absolute right-1 top-1 h-6 w-6 cursor-pointer rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-600"
                onClick={() => remove(id)}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
