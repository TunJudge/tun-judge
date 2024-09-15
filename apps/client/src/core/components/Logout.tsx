import { FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'tw-react-components';

import { useAuthContext } from '../contexts';
import { request } from '../utils';

export const Logout: FC<{ basePath?: string }> = ({ basePath = '/secure' }) => {
  const navigate = useNavigate();
  const { setLastConnectedTime } = useAuthContext();
  const req = useRef<Promise<void>>();

  useEffect(() => {
    if (req.current) return;

    req.current = request('api/auth/logout')
      .then(() => setLastConnectedTime(undefined))
      .finally(() => navigate(`${basePath}/login`));
  }, [basePath, navigate, setLastConnectedTime]);

  return <Spinner fullScreen />;
};
