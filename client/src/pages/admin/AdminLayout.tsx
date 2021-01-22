import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Scoreboard from '../shared/Scoreboard';
import AdminNavbar from './AdminNavbar';
import AdminSideBar from './AdminSidebar';
import ContestsList from './views/contests/ContestsList';
import Dashboard from './views/Dashboard';
import ExecutablesList from './views/executables/ExecutablesList';
import JudgeHostsList from './views/judge-hosts/JudgeHostsList';
import LanguagesList from './views/languages/LanguagesList';
import ProblemsList from './views/problems/ProblemsList';
import ProblemView from './views/problems/ProblemView';
import SubmissionsList from './views/submissions/SubmissionsList';
import SubmissionsView from './views/submissions/SubmissionView';
import TeamCategoriesList from './views/team-category/TeamCategoriesList';
import TeamsList from './views/teams/TeamsList';
import UsersList from './views/users/UsersList';

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
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/contests" component={ContestsList} />
          <Route exact path="/problems" component={ProblemsList} />
          <Route path="/problems/:id" component={ProblemView} />
          <Route exact path="/languages" component={LanguagesList} />
          <Route exact path="/executables" component={ExecutablesList} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/teams" component={TeamsList} />
          <Route exact path="/team-categories" component={TeamCategoriesList} />
          <Route exact path="/judge-hosts" component={JudgeHostsList} />
          <Route exact path="/submissions" component={SubmissionsList} />
          <Route path="/submissions/:id" component={SubmissionsView} />
          <Route exact path="/scoreboard" component={Scoreboard} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  );
};

export default AdminLayout;
