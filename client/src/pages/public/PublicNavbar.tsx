import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ActiveContestSelector from '../shared/ActiveContestSelector';
import NavBar from '../shared/NavBar';

type Tabs = '' | 'problems' | 'login';

const PublicNavbar: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(location.pathname.replace(/\/?/g, ''));
  const history = useHistory();

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
      ]}
    />
  );
};

export default PublicNavbar;
