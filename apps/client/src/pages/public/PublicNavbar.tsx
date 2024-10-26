import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSelector } from 'tw-react-components';

import { NavBar } from '@core/components';

type Tabs = '' | 'problems' | 'login';

const PublicNavbar: React.FC = observer(() => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState(window.location.pathname.replace(/\/?/g, ''));

  // history.listen(() => setCurrentTab(window.location.pathname.replace(/\/?/g, '')));

  const onLinkClick = (tab: Tabs) => {
    setCurrentTab(tab);
    navigate(tab);
    // history.push(`/${tab}`);
  };

  return (
    <NavBar
      logo={
        <div className="cursor-pointer text-lg text-white" onClick={() => onLinkClick('')}>
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
          testId: 'navbar-login-btn',
          onClick: () => onLinkClick('login'),
        },
        // { content: <ActiveContestSelector className="text-white" /> },
        { content: <ThemeSelector /> },
      ]}
    />
  );
});

export default PublicNavbar;
