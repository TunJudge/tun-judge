import React, { useEffect, useState } from 'react';
import PublicNavbar from './PublicNavbar';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProblemSet from '../shared/ProblemSet';
import HomeView from './views/HomeView';
import { rootStore } from '../../core/stores/RootStore';
import ContestCountdown from '../shared/ContestCountdown';
import { observer } from 'mobx-react';
import { updateLeftTimeToContest } from '../../core/helpers';

const PublicLayout: React.FC = observer(() => {
  const [leftToContest, setLeftToContest] = useState<number>(0);
  const { currentContest } = rootStore.publicStore;

  useEffect(() => updateLeftTimeToContest(currentContest, setLeftToContest), [currentContest]);

  return (
    <div>
      <PublicNavbar />
      <div style={{ paddingTop: '7rem' }}>
        {leftToContest ? (
          <ContestCountdown leftTime={leftToContest} />
        ) : (
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/problems" component={() => <ProblemSet />} />
            <Route render={() => <Redirect to={`/login?returnUrl=${location.pathname}`} />} />
          </Switch>
        )}
      </div>
    </div>
  );
});

export default PublicLayout;
