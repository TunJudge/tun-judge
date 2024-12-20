import { FC } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Block, Flex } from 'tw-react-components';

import { ContestCountdown, Login, NoActiveContest, ProblemSet } from '@core/components';
import { useTimeLeftToContest } from '@core/hooks';

import PublicNavbar from './PublicNavbar';
import HomeView from './views/HomeView';

export const PublicLayout: FC = () => {
  const location = useLocation();
  const timeLeftToContest = useTimeLeftToContest();

  return (
    <Flex className="h-screen" direction="column" align="center" fullWidth>
      <PublicNavbar />
      <Block fullHeight fullWidth>
        {location.pathname !== '/login' &&
          (!Number.isFinite(timeLeftToContest) ? (
            <NoActiveContest />
          ) : (
            timeLeftToContest > 0 && <ContestCountdown timeLeft={timeLeftToContest} />
          ))}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/problems" element={<ProblemSet />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={<Navigate to={`/login?returnUrl=${window.location.pathname}`} replace />}
          />
        </Routes>
      </Block>
    </Flex>
  );
};
