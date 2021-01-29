import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Label, Menu, Sidebar } from 'semantic-ui-react';
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
      icon: 'home',
    },
    {
      key: 'contests',
      title: 'Contests',
      icon: 'trophy',
    },
    {
      key: 'problems',
      title: 'Problems',
      icon: 'file alternate',
    },
    {
      key: 'languages',
      title: 'Languages',
      icon: 'code',
    },
    {
      key: 'executables',
      title: 'Executables',
      icon: 'cogs',
    },
    {
      key: 'users',
      title: 'Users',
      icon: 'user',
    },
    {
      key: 'teams',
      title: 'Teams',
      icon: 'users',
    },
    {
      key: 'team-categories',
      title: 'Team Category',
      icon: 'tags',
    },
    {
      key: 'judge-hosts',
      title: 'Judge Hosts',
      icon: 'server',
    },
    {
      key: 'submissions',
      title: 'Submissions',
      icon: 'paper plane outline',
      label:
        totalPendingSubmissions > 0 ? (
          <Label color="orange">{totalPendingSubmissions}</Label>
        ) : undefined,
    },
    {
      key: 'scoreboard',
      title: 'Scoreboard',
      icon: 'list ol',
    },
  ];

  return (
    <Sidebar
      as={Menu}
      animation="push"
      direction="left"
      visible={visible}
      inverted
      vertical
      borderless
    >
      <Menu.Item as="a" header onClick={() => onLinkClick('')} style={{ textAlign: 'center' }}>
        <h1>TUN-JUDGE</h1>
      </Menu.Item>
      {tabs.map((tab) => (
        <Menu.Item
          key={tab.key}
          as="a"
          active={currentTab === tab.key}
          onClick={() => onLinkClick(tab.key)}
        >
          <Icon name={tab.icon} />
          {tab.label}
          {tab.title}
        </Menu.Item>
      ))}
    </Sidebar>
  );
});

export default AdminSidebar;
