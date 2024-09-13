import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';

import { RootStore, useStore } from '@core/stores';

export const DarkModeSwitcher: React.FC<{ className?: string }> = observer(({ className }) => {
  const { appLocalCache, setDarkMode } = useStore<RootStore>('rootStore');

  return (
    <Switch
      checked={appLocalCache.darkMode}
      onChange={setDarkMode}
      className={classNames(
        className,
        'flex h-8 w-14 items-center rounded-full border p-1 dark:border-blue-700',
        {
          'bg-blue-700': appLocalCache.darkMode,
          'bg-gray-100': !appLocalCache.darkMode,
        },
      )}
      test-id="dark-mode-switch"
    >
      <div
        className={classNames('flex transform transition duration-200 ease-in-out', {
          'translate-x-6': appLocalCache.darkMode,
          'translate-x-0': !appLocalCache.darkMode,
        })}
      >
        {appLocalCache.darkMode ? (
          <MoonIcon className="h-6 w-6 rounded-full bg-gray-800 p-1 text-white" />
        ) : (
          <SunIcon className="h-6 w-6 rounded-full bg-gray-300 p-1 text-black" />
        )}
      </div>
    </Switch>
  );
});
