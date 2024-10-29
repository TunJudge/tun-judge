import { observer } from 'mobx-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSelector } from 'tw-react-components';

import { NavBar } from '@core/components';
import { useTimeLeftToContest } from '@core/hooks';

import { ActiveContestSelector } from '../../core/components/ActiveContestSelector';

const PublicNavbar: React.FC = observer(() => {
  const location = useLocation();
  const timeLeftToContest = useTimeLeftToContest();

  const tabs = [{ name: 'Problem Set', path: '/problems', hide: timeLeftToContest > 0 }];

  return (
    <NavBar
      logo={
        <Link className="cursor-pointer text-xl font-medium text-white" to="/">
          TunJudge
        </Link>
      }
      leftItems={tabs.map((tab) => ({
        content: <Link to={tab.path}>{tab.name}</Link>,
        active: tab.path === location.pathname,
        hide: tab.hide,
      }))}
      rightItems={[
        { type: 'element', element: <ActiveContestSelector className="text-white" /> },
        {
          content: <Link to="/login">Login</Link>,
          active: location.pathname === 'login',
          testId: 'navbar-login-btn',
        },
        { type: 'element', element: <ThemeSelector /> },
      ]}
    />
  );
});

export default PublicNavbar;
