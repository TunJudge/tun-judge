import { Menu } from '@headlessui/react';
import { LogoutIcon, UserIcon, ViewListIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { RootStore, useStore } from '@core/stores';
import ActiveContestSelector from '@shared/ActiveContestSelector';
import { DarkModeSwitcher } from '@shared/DarkModeSwitcher';

type AdminNavbarProps = { toggleSidebar: () => void };

const AdminNavbar: React.FC<AdminNavbarProps> = observer(({ toggleSidebar }) => {
  const { profile } = useStore<RootStore>('rootStore');

  const history = useHistory();

  return (
    <div className="p-4 pb-0" test-id="admin-navbar">
      <div className="flex w-full select-none items-center justify-between rounded-md bg-white p-1 px-3 text-black shadow-md dark:bg-gray-800 dark:text-white">
        <ViewListIcon
          className="h-6 w-6 cursor-pointer"
          onClick={toggleSidebar}
          test-id="admin-sidebar-toggle"
        />
        <div className="flex items-center gap-2">
          <ActiveContestSelector className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700" />
          <Menu as="div" className="relative" test-id="admin-user-menu">
            <Menu.Button
              as="div"
              className="flex cursor-pointer items-center justify-center gap-1 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              test-id="navbar-user"
            >
              <UserIcon className="h-4 w-4" />
              {profile?.name ?? '-'}
            </Menu.Button>
            <Menu.Items className="absolute left-1/2 z-50 mt-4 w-36 -translate-x-1/2 transform gap-2 rounded-md bg-white p-2 shadow-md outline-none dark:bg-gray-800">
              <Menu.Item onClick={() => history.push('/logout')}>
                <div
                  className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  test-id="logout-btn"
                >
                  <LogoutIcon className="h-4 w-4" />
                  Logout
                </div>
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <DarkModeSwitcher />
        </div>
      </div>
    </div>
  );
});

export default AdminNavbar;
