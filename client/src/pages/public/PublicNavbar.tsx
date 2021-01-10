import React, { useState } from 'react';
import { Container, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import ActiveContestSelector from '../shared/ActiveContestSelector';

type Tabs = '' | 'problems';

const PublicNavbar: React.FC = () => {
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
        <Menu.Menu position="right">
          <Menu.Item header onClick={() => history.push('/login')}>
            Login
          </Menu.Item>
          <ActiveContestSelector />
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default PublicNavbar;
