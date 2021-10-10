import { Menu } from '@headlessui/react';
import { LogoutIcon, UserIcon, ViewListIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { rootStore } from '../../core/stores/RootStore';
import ActiveContestSelector from '../shared/ActiveContestSelector';
import { DarkModeSwitcher } from '../shared/DarkModeSwitcher';

type AdminNavbarProps = { toggleSidebar: () => void };

const AdminNavbar: React.FC<AdminNavbarProps> = observer(({ toggleSidebar }) => {
  const history = useHistory();
  const { profile } = rootStore;

  return (
    <div className="p-4 pb-0">
      <div className="select-none p-1 px-3 text-black bg-white shadow-md rounded-md flex items-center w-full justify-between dark:text-white dark:bg-gray-800">
        <ViewListIcon className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
        <div className="flex items-center gap-2">
          <ActiveContestSelector className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" />
          <Menu as="div" className="relative">
            <Menu.Button
              as="div"
              className="flex items-center justify-center gap-1 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <UserIcon className="h-4 w-4" />
              {profile?.name ?? '-'}
            </Menu.Button>
            <Menu.Items className="absolute z-50 transform left-1/2 -translate-x-1/2 w-36 mt-4 p-2 gap-2 bg-white rounded-md shadow-md outline-none dark:bg-gray-800">
              <Menu.Item onClick={() => history.push('/logout')}>
                <div className="flex items-center gap-1 px-3 py-2 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
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
