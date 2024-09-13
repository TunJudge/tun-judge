import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { updateLeftTimeToContest } from '@core/helpers';
import { LanguagesStore, PublicStore, useStore } from '@core/stores';
import ContestCountdown from '@shared/ContestCountdown';
import { NoActiveContest } from '@shared/NoActiveContest';
import ProblemSet from '@shared/ProblemSet';
import Scoreboard from '@shared/Scoreboard';

import TeamNavbar from './TeamNavbar';
import HomeView from './views/HomeView';

const TeamLayout: React.FC = observer(() => {
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { fetchAll } = useStore<LanguagesStore>('languagesStore');

  const [leftToContest, setLeftToContest] = useState<number>(1);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  updateLeftTimeToContest(currentContest, setLeftToContest);

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <TeamNavbar />
      <div className="h-full">
        {!currentContest ? (
          <NoActiveContest />
        ) : leftToContest ? (
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
