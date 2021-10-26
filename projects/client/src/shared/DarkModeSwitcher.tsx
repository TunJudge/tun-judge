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
        'flex items-center p-1 w-14 h-8 rounded-full border dark:border-blue-700',
        {
          'bg-blue-700': appLocalCache.darkMode,
          'bg-gray-100': !appLocalCache.darkMode,
        }
      )}
      test-id="dark-mode-switch"
    >
      <div
        className={classNames('flex transform transition ease-in-out duration-200', {
          'translate-x-6': appLocalCache.darkMode,
          'translate-x-0': !appLocalCache.darkMode,
        })}
      >
        {appLocalCache.darkMode ? (
          <MoonIcon className="text-white p-1 h-6 w-6 rounded-full bg-gray-800" />
        ) : (
          <SunIcon className="text-black p-1 h-6 w-6 rounded-full bg-gray-300" />
        )}
      </div>
    </Switch>
  );
});
