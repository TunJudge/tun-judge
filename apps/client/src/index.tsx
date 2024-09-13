import { Provider } from 'mobx-react';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import {
  ClarificationsStore,
  ContestsStore,
  ExecutablesStore,
  JudgeHostsStore,
  LanguagesStore,
  ProblemsStore,
  PublicStore,
  SubmissionsStore,
  TeamCategoriesStore,
  TeamStore,
  TeamsStore,
  TestcasesStore,
  UsersStore,
  rootStore,
} from '@core/stores';
import Spinner from '@shared/Spinner';

import Root from './Root';
import './index.scss';

function buildStores() {
  const publicStore = new PublicStore(rootStore);
  const problemsStore = new ProblemsStore();
  return {
    rootStore,
    publicStore,
    problemsStore,
    teamStore: new TeamStore(),
    usersStore: new UsersStore(),
    teamsStore: new TeamsStore(),
    contestsStore: new ContestsStore(),
    testcasesStore: new TestcasesStore(problemsStore),
    languagesStore: new LanguagesStore(),
    judgeHostsStore: new JudgeHostsStore(),
    executablesStore: new ExecutablesStore(),
    submissionsStore: new SubmissionsStore(publicStore),
    teamCategoriesStore: new TeamCategoriesStore(),
    clarificationsStore: new ClarificationsStore(),
  };
}

ReactDOM.render(
  <Suspense fallback={<Spinner fullScreen />}>
    <Provider {...buildStores()}>
      <Root />
    </Provider>
  </Suspense>,
  document.getElementById('root'),
);
