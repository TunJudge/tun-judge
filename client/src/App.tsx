import React from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import Login from './pages/shared/Login';
import TeamLayout from './pages/team/TeamLayout';
import AdminLayout from './pages/admin/layout/AdminLayout';
import PublicLayout from './pages/public/PublicLayout';
import { rootStore } from './core/stores/RootStore';
import { observer } from 'mobx-react';
import { Role } from './core/models';
import Spinner from './pages/shared/Spinner';
import Logout from './pages/shared/Logout';

function getLayout(role: Role): React.FC {
  if (role.name === 'admin') return AdminLayout;
  if (role.name === 'team') return TeamLayout;
  return PublicLayout;
}

export const AuthRoute: React.FC<RouteProps> = observer((props) =>
  !rootStore.connected ? <Route {...props} /> : <Redirect to={'/'} />,
);

export const App: React.FC = observer(() => {
  const { connected, profile } = rootStore;
  const Layout = connected ? (profile ? getLayout(profile.role) : Spinner) : PublicLayout;
  return (
    <BrowserRouter>
      <Switch>
        <AuthRoute path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Layout />
      </Switch>
    </BrowserRouter>
  );
});

export default App;
