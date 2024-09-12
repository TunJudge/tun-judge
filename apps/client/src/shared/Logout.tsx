import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { RootStore, useStore } from '@core/stores';
import http from '@core/utils/http-client';

import Spinner from './Spinner';

const Logout: React.FC = () => {
  const rootStore = useStore<RootStore>('rootStore');

  const history = useHistory();

  useEffect(() => {
    http
      .get('api/auth/logout')
      .then(() => rootStore.logout())
      .finally(() => history.replace('/'));
  }, [rootStore, history]);

  return <Spinner fullScreen />;
};

export default Logout;
