import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { rootStore } from '../../core/stores/RootStore';

export const DarkModeSwitcher: React.FC<{ className?: string }> = observer(({ className }) => {
  const {
    appLocalCache: { darkMode },
    setDarkMode,
  } = rootStore;

  return (
    <Switch
      checked={darkMode}
      onChange={setDarkMode}
      className={classNames(
        className,
        'flex items-center p-1 w-14 h-8 rounded-full border dark:border-blue-700',
        {
          'bg-blue-700': darkMode,
          'bg-gray-100': !darkMode,
        },
      )}
    >
      <div
        className={classNames('flex transform transition ease-in-out duration-200', {
          'translate-x-6': darkMode,
          'translate-x-0': !darkMode,
        })}
      >
        {darkMode ? (
          <MoonIcon className="text-white p-1 h-6 w-6 rounded-full bg-gray-800" />
        ) : (
          <SunIcon className="text-black p-1 h-6 w-6 rounded-full bg-gray-300" />
        )}
      </div>
    </Switch>
  );
});
