import { observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { RootStore, useStore } from '@core/stores';

import Scoreboard from '@shared/Scoreboard';

import AdminNavbar from './AdminNavbar';
import AdminSideBar from './AdminSidebar';
import Dashboard from './views/Dashboard';
import ClarificationsList from './views/clarifications/ClarificationsList';
import ContestsList from './views/contests/ContestsList';
import ExecutablesList from './views/executables/ExecutablesList';
import JudgeHostsList from './views/judge-hosts/JudgeHostsList';
import LanguagesList from './views/languages/LanguagesList';
import ProblemView from './views/problems/ProblemView';
import ProblemsList from './views/problems/ProblemsList';
import SubmissionsView from './views/submissions/SubmissionView';
import SubmissionsList from './views/submissions/SubmissionsList';
import TeamCategoriesList from './views/team-category/TeamCategoriesList';
import TeamsList from './views/teams/TeamsList';
import UsersList from './views/users/UsersList';

const AdminLayout: React.FC = observer(() => {
  const { appLocalCache } = useStore<RootStore>('rootStore');

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSideBar visible={!appLocalCache.menuCollapsed} />
      <div className="flex flex-col w-full overflow-hidden">
        <AdminNavbar
          toggleSidebar={() => (appLocalCache.menuCollapsed = !appLocalCache.menuCollapsed)}
        />
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
          <Route exact path="/clarifications" component={ClarificationsList} />
          <Route exact path="/scoreboard" component={Scoreboard} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  );
});

export default AdminLayout;
