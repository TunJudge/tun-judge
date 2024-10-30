import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Block, Flex } from 'tw-react-components';

import { ContestCountdown, NoActiveContest, ProblemSet, Scoreboard } from '@core/components';
import { useTimeLeftToContest } from '@core/hooks';

import { TeamNavbar } from './TeamNavbar';
import { HomeView } from './views/HomeView';

export const TeamLayout: FC = () => {
  const timeLeftToContest = useTimeLeftToContest();

  return (
    <Flex className="h-screen" direction="column" fullWidth>
      <TeamNavbar />
      <Block fullHeight fullWidth>
        {!Number.isFinite(timeLeftToContest) ? (
          <NoActiveContest />
        ) : (
          timeLeftToContest > 0 && <ContestCountdown timeLeft={timeLeftToContest} />
        )}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/problems" element={<ProblemSet />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Block>
    </Flex>
  );
};
