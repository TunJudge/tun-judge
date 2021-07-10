import { Menu, Transition } from '@headlessui/react';
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
    <div className="select-none p-1 text-black bg-white shadow rounded-md border flex items-center w-full justify-between dark:text-white dark:bg-gray-800 dark:border-gray-700">
      <ViewListIcon className="h-6 w-6 mx-2 cursor-pointer" onClick={toggleSidebar} />
      <div className="flex items-center">
        <ActiveContestSelector className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Menu as="div" className="relative">
          <Menu.Button
            as="div"
            className="flex items-center justify-center gap-1 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <UserIcon className="h-4 w-4" />
            {profile?.name ?? '-'}
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-36 mt-2 p-2 gap-2 origin-top-right bg-white rounded-md shadow-lg outline-none dark:bg-gray-800">
              <Menu.Item onClick={() => history.push('/logout')}>
                <div className="flex items-center gap-1 px-3 py-2 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <LogoutIcon className="h-4 w-4" />
                  Logout
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <DarkModeSwitcher className="mr-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" />
      </div>
    </div>
  );
});

export default AdminNavbar;
