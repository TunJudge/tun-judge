import React from 'react';
import PublicNavbar from './PublicNavbar';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProblemSet from '../shared/ProblemSet';
import HomeView from './views/HomeView';

const PublicLayout: React.FC = () => (
  <div>
    <PublicNavbar />
    <div style={{ paddingTop: '7rem' }}>
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route exact path="/problems" component={() => <ProblemSet />} />
        <Route render={() => <Redirect to={`/login?returnUrl=${location.pathname}`} />} />
      </Switch>
    </div>
  </div>
);

export default PublicLayout;
