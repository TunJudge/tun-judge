import { observer, useLocalStore } from 'mobx-react';
import qs from 'querystring';
import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { isEmpty } from '@core/helpers';
import { RootStore, useStore } from '@core/stores';
import http from '@core/utils/http-client';

import TextInput from './form-controls/TextInput';
import { FormErrors } from './form-controls/types';

type Credentials = {
  username: string;
  password: string;
};

const Login: React.FC = observer(() => {
  const credentials = useLocalStore<Credentials>(() => ({
    username: '',
    password: '',
  }));
  const { appLocalCache } = useStore<RootStore>('rootStore');
  const history = useHistory();

  const [errors, setErrors] = useState<FormErrors<Credentials>>({});

  useEffect(() => {
    setErrors({
      username: isEmpty(credentials.username),
      password: isEmpty(credentials.password),
    });
  }, [credentials]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await http.post('api/auth/login', credentials);
      appLocalCache.connected = Date.now();
      appLocalCache.menuCollapsed = false;
      const { returnUrl } = qs.parse(location.search.substr(1));
      history.replace((returnUrl as string) ?? '/');
    } catch (e) {}
  };

  return (
    <div className="flex h-full items-center justify-center dark:text-white">
      <div className="mx-4 flex w-full flex-col items-center sm:mx-0 sm:w-96">
        <div className="mb-4 text-4xl text-gray-900 dark:text-white">Sign-in</div>
        <form
          className="grid w-full gap-3 rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
          onSubmit={login}
        >
          <TextInput<Credentials>
            entity={credentials}
            field="username"
            testId="username"
            placeHolder="Username"
            autoComplete="username"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextInput<Credentials>
            entity={credentials}
            field="password"
            testId="password"
            type="Password"
            placeHolder="Password"
            autoComplete="username"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <button
            className="mx-auto w-1/4 rounded-md bg-blue-500 p-2 text-white"
            test-id="login-btn"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-2 text-sm">TunJudge v{process.env.REACT_APP_VERSION}</div>
      </div>
    </div>
  );
});

export default Login;
