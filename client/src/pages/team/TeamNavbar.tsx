import React, { useState } from 'react';
import { Button, Container, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { Tabs } from '../../core/types';

const tabs: Tabs = [
  {
    key: '',
    title: 'Home',
    icon: 'home',
  },
  {
    key: 'problems',
    title: 'Problem Set',
    icon: 'file alternate',
  },
  {
    key: 'scoreboard',
    title: 'Scoreboard',
    icon: 'list ol',
  },
];

const TeamNavbar: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  const onLinkClick = (tab: string) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <Menu fixed="top" borderless inverted>
      <Container>
        <Menu.Item as="a" header onClick={() => onLinkClick('')}>
          TUN-JUDGE
        </Menu.Item>
        {tabs.map((tab) => (
          <Menu.Item
            key={tab.key}
            as="a"
            active={currentTab === tab.key}
            onClick={() => onLinkClick(tab.key)}
          >
            <Icon name={tab.icon} />
            {tab.title}
          </Menu.Item>
        ))}
        <Menu.Menu position="right">
          <Menu.Item>
            <Icon name="clock" />
            contest_time
          </Menu.Item>
          <Menu.Item>
            <Button color="green" size="mini" style={{ marginRight: '0.5rem' }}>
              <Icon name="cloud upload" />
              Submit
            </Button>
            <Button color="red" onClick={() => history.push('/logout')}>
              <Icon name="log out" />
              Logout
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default TeamNavbar;
