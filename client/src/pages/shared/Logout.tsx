import React, { useEffect } from 'react';
import { request } from '../../core/helpers';
import { rootStore } from '../../core/stores/RootStore';
import Spinner from './Spinner';
import { useHistory } from 'react-router-dom';

const Logout: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    request('api/auth/logout', 'GET')
      .then(() => rootStore.logout())
      .finally(() => history.push('/'));
  }, [history]);

  return <Spinner />;
};

export default Logout;
