import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ActiveContestSelector from '../shared/ActiveContestSelector';
import { DarkModeSwitcher } from '../shared/DarkModeSwitcher';
import NavBar from '../shared/NavBar';

type Tabs = '' | 'problems' | 'login';

const PublicNavbar: React.FC = observer(() => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

  history.listen(() => setCurrentTab(location.pathname.replace(/\/?/g, '')));

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    history.push(`/${tab}`);
  };

  return (
    <NavBar
      logo={
        <div className="text-white text-lg cursor-pointer" onClick={() => onLinkClick('')}>
          TunJudge
        </div>
      }
      leftItems={[
        { content: 'Scoreboard', active: currentTab === '', onClick: () => onLinkClick('') },
        {
          content: 'Problem Set',
          active: currentTab === 'problems',
          onClick: () => onLinkClick('problems'),
        },
      ]}
      rightItems={[
        {
          content: 'Login',
          active: currentTab === 'login',
          onClick: () => onLinkClick('login'),
        },
        { content: <ActiveContestSelector className="text-white" /> },
        { content: <DarkModeSwitcher /> },
      ]}
    />
  );
});

export default PublicNavbar;
