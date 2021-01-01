import React from 'react';
import PublicNavbar from './PublicNavbar';
import Scoreboard from '../shared/Scoreboard';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProblemSet from '../shared/ProblemSet';

const PublicLayout: React.FC = () => (
  <div>
    <PublicNavbar />
    <div style={{ paddingTop: '7rem' }}>
      <Switch>
        <Route exact path="/" component={() => <Scoreboard />} />
        <Route exact path="/problems" component={() => <ProblemSet />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </div>
);

export default PublicLayout;
