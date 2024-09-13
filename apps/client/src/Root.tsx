import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Role } from '@core/models';
import { RootStore, useStore } from '@core/stores';
import Logout from '@shared/Logout';
import Spinner from '@shared/Spinner';
import ToastContainer from '@shared/ToastContainer';
import TooltipContainer from '@shared/tooltip/TooltipContainer';

const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const TeamLayout = React.lazy(() => import('./pages/team/TeamLayout'));
const PublicLayout = React.lazy(() => import('./pages/public/PublicLayout'));

function renderLayout(role?: Role): React.ReactNode {
  if (!role) return <Spinner fullScreen />;
  if (role.name === 'admin') return <AdminLayout />;
  if (role.name === 'jury') return <AdminLayout />;
  if (role.name === 'team') return <TeamLayout />;
  return <PublicLayout />;
}

export const Root: React.FC = observer(() => {
  const {
    connected,
    profile,
    appLocalCache: { darkMode },
  } = useStore<RootStore>('rootStore');

  return (
    <div className={classNames({ dark: darkMode })}>
      <BrowserRouter>
        <Switch>
          <Route path="/logout" component={Logout} />
          {connected ? renderLayout(profile?.role) : <PublicLayout />}
        </Switch>
        <ToastContainer />
        <TooltipContainer />
      </BrowserRouter>
    </div>
  );
});

export default Root;
