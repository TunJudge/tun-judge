import {
  AcademicCapIcon,
  ChartBarIcon,
  ChatIcon,
  ClipboardListIcon,
  CodeIcon,
  CogIcon,
  HomeIcon,
  PaperAirplaneIcon,
  ServerIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { PublicStore } from '@core/stores/PublicStore';
import { useStore } from '@core/stores/useStore';
import { Tabs } from '@core/types';
import Tooltip from '@shared/tooltip/Tooltip';

const AdminSidebar: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const { totalPendingSubmissions } = useStore<PublicStore>('publicStore');

  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  history.listen(() => setCurrentTab(location.pathname.replace(/\/?/g, '')));

  const onLinkClick = (tab: string) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  const tabs: Tabs = [
    {
      key: '',
      title: 'Home',
      icon: HomeIcon,
    },
    {
      key: 'contests',
      title: 'Contests',
      icon: AcademicCapIcon,
    },
    {
      key: 'problems',
      title: 'Problems',
      icon: ClipboardListIcon,
    },
    {
      key: 'languages',
      title: 'Languages',
      icon: CodeIcon,
    },
    {
      key: 'executables',
      title: 'Executables',
      icon: CogIcon,
    },
    {
      key: 'users',
      title: 'Users',
      icon: UserIcon,
    },
    {
      key: 'teams',
      title: 'Teams',
      icon: UsersIcon,
    },
    {
      key: 'team-categories',
      title: 'Team Categories',
      icon: TagIcon,
    },
    {
      key: 'judge-hosts',
      title: 'Judge Hosts',
      icon: ServerIcon,
    },
    {
      key: 'submissions',
      title: 'Submissions',
      icon: PaperAirplaneIcon,
      label:
        totalPendingSubmissions > 0 ? (
          <div className="rounded-md bg-yellow-500 px-2 py-0.5 text-white">
            {totalPendingSubmissions}
          </div>
        ) : undefined,
    },
    {
      key: 'clarifications',
      title: 'Clarifications',
      icon: ChatIcon,
    },
    {
      key: 'scoreboard',
      title: 'Scoreboard',
      icon: ChartBarIcon,
    },
  ];

  return (
    <nav className="p-4 pr-0 text-black dark:text-white">
      <div
        className={classNames('h-full flex-col transition-all duration-200 ease-in-out', {
          'w-72': visible,
          'w-16': !visible,
        })}
        test-id="admin-sidebar"
      >
        <div className="h-full rounded-lg bg-white p-2 shadow-md dark:bg-gray-800">
          <div
            className="mb-2 cursor-pointer p-2 py-4 text-center text-2xl"
            onClick={() => onLinkClick('')}
          >
            {visible ? 'TUN-JUDGE' : 'TJ'}
          </div>
          <div className="space-y-1">
            {tabs.map(({ key, icon: Icon, label, title }) => (
              <Tooltip
                className="ml-1"
                key={key}
                position="right"
                content={title}
                forceHide={visible}
              >
                <div
                  className={classNames(
                    'flex w-full cursor-pointer items-center gap-2 rounded-md p-2 font-medium',
                    {
                      'bg-gray-800 text-white dark:bg-gray-900': currentTab === key,
                      'text-gray-500 hover:bg-gray-500 hover:text-white dark:text-gray-400 dark:hover:bg-gray-700':
                        currentTab !== key,
                      'justify-center': !visible,
                    },
                  )}
                  onClick={() => onLinkClick(key)}
                  test-id={`admin-sidebar-item-${key}`}
                >
                  <Icon className="h-6 w-6" />
                  {visible && (
                    <div test-id="admin-sidebar-item-title">
                      {title}
                      <div className="ml-auto flex items-center space-x-2">{label}</div>
                    </div>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
});

export default AdminSidebar;
