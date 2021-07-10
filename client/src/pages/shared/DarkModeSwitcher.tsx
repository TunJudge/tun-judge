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
    <div
      className={classNames(className, 'cursor-pointer')}
      title="Dark mode switcher"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
    </div>
  );
});
