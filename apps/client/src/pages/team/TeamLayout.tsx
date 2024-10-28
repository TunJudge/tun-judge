import { FC } from 'react';
import { Block, Flex } from 'tw-react-components';

import { ContestCountdown, NoActiveContest } from '@core/components';
import { useTimeLeftToContest } from '@core/hooks';

import { TeamNavbar } from './TeamNavbar';

export const TeamLayout: FC = () => {
  const timeLeftToContest = useTimeLeftToContest();

  return (
    <Flex className="h-screen" direction="column" fullWidth>
      <TeamNavbar />
      <Block fullHeight fullWidth>
        {!Number.isFinite(timeLeftToContest) ? (
          <NoActiveContest />
        ) : (
          timeLeftToContest && <ContestCountdown timeLeft={timeLeftToContest} />
        )}
      </Block>
    </Flex>
  );
};
// /* {!currentContest ? (
//   <NoActiveContest />
// ) : leftToContest ? (
//   <ContestCountdown leftTime={leftToContest} />
// ) : (
//   <Switch>
//     <Route exact path="/" component={HomeView} />
//     <Route exact path="/problems" component={ProblemSet} />
//     <Route exact path="/scoreboard" component={Scoreboard} />
//     <Route render={() => <Redirect to="/" />} />
//   </Switch>
// )} */
