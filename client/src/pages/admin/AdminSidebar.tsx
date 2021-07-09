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
import { rootStore } from '../../core/stores/RootStore';
import { Tabs } from '../../core/types';

const AdminSidebar: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();
  const {
    publicStore: { totalPendingSubmissions },
  } = rootStore;

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
      title: 'Team Category',
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
          <div className="text-white px-2 py-0.5 rounded-md bg-yellow-500">
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
    <nav className="bg-gray-800">
      <div
        className={classNames(
          'flex-col text-white h-full transition-all duration-300 ease-in-out',
          {
            'w-72 p-2': visible,
            'w-0': !visible,
          },
        )}
      >
        <div
          className="text-2xl text-center p-4 mb-2 cursor-pointer"
          onClick={() => onLinkClick('')}
        >
          TUN-JUDGE
        </div>
        <div className="space-y-1">
          {visible &&
            tabs.map(({ key, icon: Icon, label, title }) => (
              <div
                key={key}
                className={classNames(
                  'flex items-center w-full p-2 rounded-md font-medium cursor-pointer',
                  {
                    'bg-gray-900 text-white': currentTab === key,
                    'text-gray-400 hover:bg-gray-700 hover:text-white': currentTab !== key,
                  },
                )}
                onClick={() => onLinkClick(key)}
              >
                <Icon className="h-7 w-7 mr-2" />
                {title}
                <div className="flex items-center space-x-2 ml-auto">{label}</div>
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
});

export default AdminSidebar;
