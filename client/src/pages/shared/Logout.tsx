import React, { useEffect } from 'react';
import { rootStore } from '../../core/stores/RootStore';
import Spinner from './Spinner';
import { useHistory } from 'react-router-dom';
import http from '../../core/utils/http-client';

const Logout: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    http
      .get('api/auth/logout')
      .then(() => rootStore.logout())
      .finally(() => history.push('/'));
  }, [history]);

  return <Spinner />;
};

export default Logout;
