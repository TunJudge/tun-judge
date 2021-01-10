import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import TeamNavbar from './TeamNavbar';
import Scoreboard from '../shared/Scoreboard';
import ProblemSet from '../shared/ProblemSet';
import HomeView from './views/HomeView';

const TeamLayout: React.FC = () => (
  <div>
    <TeamNavbar />
    <div style={{ padding: '1rem', paddingTop: '4rem' }}>
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route exact path="/problems" component={() => <ProblemSet />} />
        <Route exact path="/scoreboard" component={() => <Scoreboard />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </div>
);

export default TeamLayout;
