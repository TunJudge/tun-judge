import { FC, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Login } from '@core/components';

import PublicNavbar from './PublicNavbar';
import HomeView from './views/HomeView';

export const PublicLayout: FC = () => {
  const [leftToContest, setLeftToContest] = useState<number>(0);

  // updateLeftTimeToContest(currentContest, setLeftToContest);

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <PublicNavbar />
      <div className="h-full">
        {leftToContest && !window.location.pathname.startsWith('/login') ? (
          <div>Contest Countdown</div>
        ) : (
          // <ContestCountdown leftTime={leftToContest} />
          <Routes>
            <Route path="/" element={<HomeView />} />
            {/* <Route  path="/problems" component={ProblemSet} /> */}
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={<Navigate to={`/login?returnUrl=${window.location.pathname}`} replace />}
            />
          </Routes>
        )}
      </div>
    </div>
  );
};
