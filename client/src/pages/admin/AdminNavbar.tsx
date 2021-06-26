import { Menu, Transition } from '@headlessui/react';
import { LogoutIcon, UserIcon, ViewListIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { rootStore } from '../../core/stores/RootStore';
import ActiveContestSelector from '../shared/ActiveContestSelector';

type AdminNavbarProps = { toggleSidebar: () => void };

const AdminNavbar: React.FC<AdminNavbarProps> = observer(({ toggleSidebar }) => {
  const history = useHistory();
  const { profile } = rootStore;

  return (
    <div className="p-1 bg-white shadow rounded-md border flex items-center w-full justify-between">
      <ViewListIcon className="text-black h-6 w-6 mx-2 cursor-pointer" onClick={toggleSidebar} />
      <div className="flex items-center">
        <ActiveContestSelector className="p-2 rounded-md hover:bg-gray-200" />
        <Menu as="div" className="relative">
          <Menu.Button
            as="div"
            className="flex items-center justify-center gap-1 mr-2 p-2 rounded-md cursor-pointer hover:bg-gray-200"
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
            <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg outline-none">
              <Menu.Item onClick={() => history.push('/logout')}>
                <div className="flex items-center gap-1 px-3 py-2 cursor-pointer hover:bg-gray-200">
                  <LogoutIcon className="h-4 w-4" />
                  Logout
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
});

export default AdminNavbar;
