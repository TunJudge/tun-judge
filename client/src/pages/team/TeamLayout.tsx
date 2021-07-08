import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { updateLeftTimeToContest } from '../../core/helpers';
import { rootStore } from '../../core/stores/RootStore';
import ContestCountdown from '../shared/ContestCountdown';
import ProblemSet from '../shared/ProblemSet';
import Scoreboard from '../shared/Scoreboard';
import TeamNavbar from './TeamNavbar';
import HomeView from './views/HomeView';

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
    <div className="flex flex-col h-screen">
      <TeamNavbar />
      <div className="h-full">
        {leftToContest ? (
          <ContestCountdown leftTime={leftToContest} />
        ) : (
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/problems" component={ProblemSet} />
            <Route exact path="/scoreboard" component={Scoreboard} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        )}
      </div>
    </div>
  );
});

export default TeamLayout;
