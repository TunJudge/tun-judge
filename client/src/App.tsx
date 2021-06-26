import { observer } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { Role } from './core/models';
import { rootStore } from './core/stores/RootStore';
import AdminLayout from './pages/admin/AdminLayout';
import PublicLayout from './pages/public/PublicLayout';
import Logout from './pages/shared/Logout';
import Spinner from './pages/shared/Spinner';
import ToastContainer from './pages/shared/ToastContainer';
import TeamLayout from './pages/team/TeamLayout';

function getLayout(role: Role): React.FC {
  if (role.name === 'admin') return AdminLayout;
  if (role.name === 'jury') return AdminLayout;
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
        <Route path="/logout" component={Logout} />
        <Layout />
      </Switch>
      <ToastContainer />
    </BrowserRouter>
  );
});

export default App;
