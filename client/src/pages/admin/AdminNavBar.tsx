import React, { CSSProperties, useState } from 'react';
import { Button, Container, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

const style: CSSProperties = {
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  top: 0,
  bottom: 0,
  left: 0,
  width: 200,
  background: '#1B1C1D',
  overflowX: 'hidden',
};

type Tabs = '' | 'problems' | 'scoreboard';

const AdminNavBar: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <div style={{ ...style, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ flex: 1 }}>
        <Menu fluid compact inverted vertical borderless>
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
          </Container>
        </Menu>
      </div>
      <div style={{ flex: '0 0 auto' }}>
        <Button color="red" style={{ marginRight: '1rem' }} onClick={() => history.push('/logout')}>
          <Icon name="log out" />
          Logout
        </Button>
        <div style={{ color: 'white' }}>
          contest_time
          <Icon name="clock" />
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar;
