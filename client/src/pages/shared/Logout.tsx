import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { rootStore } from '../../core/stores/RootStore';
import http from '../../core/utils/http-client';
import Spinner from './Spinner';

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
