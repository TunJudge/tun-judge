import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import TeamNavbar from './TeamNavbar';
import Scoreboard from '../shared/Scoreboard';
import ProblemSet from '../shared/ProblemSet';

const TeamLayout: React.FC = () => (
  <div>
    <TeamNavbar />
    <div style={{ paddingTop: '5rem' }}>
      <Switch>
        <Route exact path="/" component={() => <>Home</>} />
        <Route path="/problems" component={() => <ProblemSet />} />
        <Route path="/scoreboard" component={() => <Scoreboard />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </div>
);

export default TeamLayout;
