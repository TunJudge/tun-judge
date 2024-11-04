import { observer } from 'mobx-react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Spinner } from 'tw-react-components';

import { Logout } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { Role } from '@core/prisma';

import { AdminLayout } from './pages/admin/AdminLayout';
import { PublicLayout } from './pages/public/PublicLayout';
import { TeamLayout } from './pages/team/TeamLayout';

function renderLayout(role?: Role): React.ReactNode {
  if (!role) return <Spinner fullScreen />;

  if (role.name === 'admin') return <AdminLayout />;
  if (role.name === 'jury') return <AdminLayout />;
  if (role.name === 'team') return <TeamLayout />;

  return <PublicLayout />;
}

export const Root: React.FC = observer(() => {
  const { profile, connected } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={connected ? renderLayout(profile?.role) : <PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
});

export default Root;
