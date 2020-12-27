import React from 'react';
import PublicNavBar from './PublicNavBar';
import Scoreboard from '../shared/Scoreboard';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProblemSet from '../shared/ProblemSet';

const PublicLayout: React.FC = () => (
  <div>
    <PublicNavBar />
    <div style={{ paddingTop: '7rem' }}>
      <Switch>
        <Route exact path="/" component={() => <Scoreboard />} />
        <Route path="/problems" component={() => <ProblemSet />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </div>
);

export default PublicLayout;
