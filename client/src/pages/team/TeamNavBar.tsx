import React, { useState } from 'react';
import { Button, Container, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

type Tabs = '' | 'problems' | 'scoreboard';

const TeamNavBar: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <Menu fixed="top" borderless inverted>
      <Container>
        <Menu.Item as="a" header onClick={() => onLinkClick('')}>
          TUN-JUDGE
        </Menu.Item>
        <Menu.Item as="a" active={currentTab === ''} onClick={() => onLinkClick('')}>
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item
          as="a"
          active={currentTab === 'problems'}
          onClick={() => onLinkClick('problems')}
        >
          <Icon name="file alternate" />
          Problem Set
        </Menu.Item>
        <Menu.Item
          as="a"
          active={currentTab === 'scoreboard'}
          onClick={() => onLinkClick('scoreboard')}
        >
          <Icon name="users" />
          Scoreboard
        </Menu.Item>
        <Menu.Item position="right">
          <Button color="green" size="mini" style={{ marginRight: '0.5rem' }}>
            <Icon name="cloud upload" />
            Submit
          </Button>
          <Button
            color="red"
            style={{ marginRight: '1rem' }}
            onClick={() => history.push('/logout')}
          >
            <Icon name="log out" />
            Logout
          </Button>
          <Icon name="clock" />
          contest_time
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default TeamNavBar;
