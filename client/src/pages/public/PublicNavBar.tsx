import React, { useState } from 'react';
import { Button, Container, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { rootStore } from '../../core/stores/RootStore';

type Tabs = '' | 'problems';

const PublicNavBar: React.FC = observer(() => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <Menu fixed="top" borderless>
      <Container>
        <Menu.Item as="a" header onClick={() => onLinkClick('')}>
          TUN-JUDGE
        </Menu.Item>
        <Menu.Item as="a" active={currentTab === ''} onClick={() => onLinkClick('')}>
          <Icon name="users" />
          Scoreboard
        </Menu.Item>
        <Menu.Item
          as="a"
          active={currentTab === 'problems'}
          onClick={() => onLinkClick('problems')}
        >
          <Icon name="file alternate" />
          Problem Set
        </Menu.Item>
        <Menu.Item as="div" position="right">
          {rootStore.connected ? (
            <Button
              color="red"
              style={{ marginRight: '1rem' }}
              onClick={() => location.assign('/logout')}
            >
              <Icon name="log out" />
              Logout
            </Button>
          ) : (
            <Button
              color="blue"
              style={{ marginRight: '0.5rem' }}
              onClick={() => history.push('/login')}
            >
              Login
            </Button>
          )}
          <Icon name="clock" />
          contest_time
        </Menu.Item>
      </Container>
    </Menu>
  );
});

export default PublicNavBar;
