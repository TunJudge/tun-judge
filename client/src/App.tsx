import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Role } from './core/models';
import { rootStore } from './core/stores/RootStore';
import AdminLayout from './pages/admin/AdminLayout';
import PublicLayout from './pages/public/PublicLayout';
import Logout from './pages/shared/Logout';
import Spinner from './pages/shared/Spinner';
import ToastContainer from './pages/shared/ToastContainer';
import TeamLayout from './pages/team/TeamLayout';

function renderLayout(role?: Role): React.ReactNode {
  if (!role) return <Spinner fullScreen />;
  if (role.name === 'admin') return <AdminLayout />;
  if (role.name === 'jury') return <AdminLayout />;
  if (role.name === 'team') return <TeamLayout />;
  return <PublicLayout />;
}

export const App: React.FC = observer(() => {
  const {
    connected,
    profile,
    appLocalCache: { darkMode },
  } = rootStore;

  return (
    <div className={classNames({ dark: darkMode })}>
      <BrowserRouter>
        <Switch>
          <Route path="/logout" component={Logout} />
          {connected ? renderLayout(profile?.role) : <PublicLayout />}
        </Switch>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
});

export default App;
