import React, { useState } from 'react';
import AdminSideBar from './AdminSidebar';
import { Redirect, Route, Switch } from 'react-router-dom';
import Scoreboard from '../../shared/Scoreboard';
import AdminNavbar from './AdminNavbar';
import ContestsList from '../contests/ContestsList';
import ProblemsList from '../problems/ProblemsList';
import ProblemView from '../problems/ProblemView';
import LanguagesList from '../languages/LanguagesList';
import UsersList from '../users/UsersList';

const AdminLayout: React.FC = () => {
  const [sidebarVisible, toggleSidebar] = useState<boolean>(true);

  return (
    <div>
      <AdminSideBar visible={sidebarVisible} />
      <div
        style={{
          padding: '1rem',
          marginLeft: sidebarVisible ? '260px' : 0,
          transition: 'margin .5s ease',
        }}
      >
        <AdminNavbar toggleSidebar={() => toggleSidebar(!sidebarVisible)} />
        <Switch>
          <Route
            exact
            path="/"
            component={() => <div style={{ textAlign: 'center' }}>Admin</div>}
          />
          <Route exact path="/contests" component={ContestsList} />
          <Route exact path="/problems" component={ProblemsList} />
          <Route path="/problems/:id" component={ProblemView} />
          <Route exact path="/languages" component={LanguagesList} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/scoreboard" component={Scoreboard} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  );
};

export default AdminLayout;
