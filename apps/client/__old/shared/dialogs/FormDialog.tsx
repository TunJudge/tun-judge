import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

import { RootStore, useStore } from '@core/stores';

type Props = {
  title: string;
  isOpen: boolean;
  submitDisabled?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
};

export const FormModal: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
  isOpen,
  submitDisabled,
  onClose,
  onSubmit,
  size = '5xl',
}) => {
  const { appLocalCache } = useStore<RootStore>('rootStore');

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className={classNames('fixed inset-0 z-10 overflow-y-auto', {
          dark: appLocalCache.darkMode,
        })}
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle">&#8203;</span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={classNames(
                'my-8 inline-grid w-full transform gap-y-4 rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800',
                {
                  'max-w-xs': size === 'xs',
                  'max-w-sm': size === 'sm',
                  'max-w-md': size === 'md',
                  'max-w-lg': size === 'lg',
                  'max-w-xl': size === 'xl',
                  'max-w-2xl': size === '2xl',
                  'max-w-3xl': size === '3xl',
                  'max-w-4xl': size === '4xl',
                  'max-w-5xl': size === '5xl',
                  'max-w-6xl': size === '6xl',
                  'max-w-7xl': size === '7xl',
                  'max-w-full': size === 'full',
                },
              )}
            >
              <div className="py-1 text-xl font-medium leading-6 text-gray-900 dark:text-gray-100">
                {title}
              </div>
              <form className="grid gap-y-2">{children}</form>
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                {onSubmit && (
                  <button
                    type="button"
                    className={classNames(
                      'rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-600 disabled:cursor-default disabled:opacity-50',
                      {
                        'hover:bg-green-200': !submitDisabled,
                      },
                    )}
                    onClick={onSubmit}
                    disabled={submitDisabled}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
