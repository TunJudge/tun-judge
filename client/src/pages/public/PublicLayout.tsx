import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { updateLeftTimeToContest } from '../../core/helpers';
import { rootStore } from '../../core/stores/RootStore';
import ContestCountdown from '../shared/ContestCountdown';
import Login from '../shared/Login';
import ProblemSet from '../shared/ProblemSet';
import PublicNavbar from './PublicNavbar';
import HomeView from './views/HomeView';

const PublicLayout: React.FC = observer(() => {
  const [leftToContest, setLeftToContest] = useState<number>(0);
  const { currentContest } = rootStore.publicStore;

  updateLeftTimeToContest(currentContest, setLeftToContest);

  return (
    <div className="flex flex-col h-screen">
      <PublicNavbar />
      <div className="h-full">
        {leftToContest && !window.location.pathname.startsWith('/login') ? (
          <ContestCountdown leftTime={leftToContest} />
        ) : (
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/problems" component={ProblemSet} />
            <Route exact path="/login" component={Login} />
            <Route render={() => <Redirect to={`/login?returnUrl=${location.pathname}`} />} />
          </Switch>
        )}
      </div>
    </div>
  );
});

export default PublicLayout;
