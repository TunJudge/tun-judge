import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { updateLeftTimeToContest } from '../../core/helpers';
import { rootStore } from '../../core/stores/RootStore';
import ContestCountdown from '../shared/ContestCountdown';
import ProblemSet from '../shared/ProblemSet';
import PublicNavbar from './PublicNavbar';
import HomeView from './views/HomeView';

const PublicLayout: React.FC = observer(() => {
  const [leftToContest, setLeftToContest] = useState<number>(0);
  const { currentContest } = rootStore.publicStore;

  updateLeftTimeToContest(currentContest, setLeftToContest);

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
