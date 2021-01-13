import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import TeamNavbar from './TeamNavbar';
import Scoreboard from '../shared/Scoreboard';
import ProblemSet from '../shared/ProblemSet';
import HomeView from './views/HomeView';
import { rootStore } from '../../core/stores/RootStore';

const TeamLayout: React.FC = () => {
  const {
    languagesStore: { fetchAll },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
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
};

export default TeamLayout;
