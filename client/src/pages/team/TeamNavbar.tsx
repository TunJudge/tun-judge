import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Dropdown, Icon, Menu } from 'semantic-ui-react';
import { contestStartedAndNotOver } from '../../core/helpers';
import { Submission } from '../../core/models';
import { rootStore } from '../../core/stores/RootStore';
import { Tabs } from '../../core/types';
import ActiveContestSelector from '../shared/ActiveContestSelector';
import SubmitForm from './views/SubmitForm';

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

const TeamNavbar: React.FC = observer(() => {
  const [submitFormOpen, setSubmitFormOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();
  const {
    profile,
    publicStore: { currentContest },
  } = rootStore;

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
          {contestStartedAndNotOver(currentContest) && (
            <Menu.Item
              className="cursor-pointer"
              style={{ backgroundColor: '#21ba45' }}
              onClick={() => setSubmitFormOpen(true)}
            >
              Submit
            </Menu.Item>
          )}
          <ActiveContestSelector />
          <Dropdown
            item
            floating
            icon={
              <>
                <Icon name="user circle" />
                {profile?.team?.name ?? '-'}
              </>
            }
          >
            <Dropdown.Menu>
              <Dropdown.Item text="Logout" icon="log out" onClick={() => history.push('/logout')} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
      {submitFormOpen && (
        <SubmitForm item={{} as Submission} dismiss={() => setSubmitFormOpen(false)} />
      )}
    </Menu>
  );
});

export default TeamNavbar;
