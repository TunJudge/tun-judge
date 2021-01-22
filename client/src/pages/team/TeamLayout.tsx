import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import TeamNavbar from './TeamNavbar';
import Scoreboard from '../shared/Scoreboard';
import ProblemSet from '../shared/ProblemSet';
import HomeView from './views/HomeView';
import { rootStore } from '../../core/stores/RootStore';
import ContestCountdown from '../shared/ContestCountdown';
import { updateLeftTimeToContest } from '../../core/helpers';
import { observer } from 'mobx-react';

const TeamLayout: React.FC = observer(() => {
  const [leftToContest, setLeftToContest] = useState<number>(0);
  const {
    publicStore: { currentContest },
    languagesStore: { fetchAll },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  updateLeftTimeToContest(currentContest, setLeftToContest);

  return (
    <div>
      <TeamNavbar />
      <div style={{ padding: '1rem', paddingTop: '4rem' }}>
        {leftToContest ? (
          <ContestCountdown leftTime={leftToContest} />
        ) : (
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/problems" component={() => <ProblemSet />} />
            <Route exact path="/scoreboard" component={() => <Scoreboard />} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        )}
      </div>
    </div>
  );
});

export default TeamLayout;
