import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import Scoreboard from '../shared/Scoreboard';
import ProblemSet from '../shared/ProblemSet';

const AdminLayout: React.FC = () => (
  <div>
    <AdminNavBar />
    <div style={{ paddingLeft: '200px' }}>
      <Switch>
        <Route exact path="/" component={() => <div style={{ textAlign: 'center' }}>Admin</div>} />
        <Route path="/problems" component={() => <ProblemSet />} />
        <Route path="/scoreboard" component={() => <Scoreboard />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </div>
);

export default AdminLayout;
