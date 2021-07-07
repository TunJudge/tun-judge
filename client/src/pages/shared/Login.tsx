import { observer, useLocalStore } from 'mobx-react';
import qs from 'querystring';
import React, { FormEvent, useEffect, useState } from 'react';
import { isEmpty } from '../../core/helpers';
import http from '../../core/utils/http-client';
import { FormErrors, TextField } from './extended-form';

type Credentials = {
  username: string;
  password: string;
};

const Login: React.FC = observer(() => {
  const credentials = useLocalStore<Credentials>(() => ({
    username: '',
    password: '',
  }));
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
      localStorage.setItem('connected', `${Date.now()}`);
      const { returnUrl } = qs.parse(location.search.substr(1));
      window.location.assign((returnUrl as string) ?? '/');
    } catch (e) {}
  };
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center w-full mx-4 sm:w-1/2 md:w-1/3 sm:mx-0">
        <div className="text-4xl text-gray-900 mb-4">Sign-in</div>
        <form className="grid gap-3 p-4 rounded-lg border bg-white w-full" onSubmit={login}>
          <TextField<Credentials>
            entity={credentials}
            field="username"
            placeHolder="Username"
            autoComplete="username"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextField<Credentials>
            entity={credentials}
            field="password"
            type="Password"
            placeHolder="Password"
            autoComplete="username"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <button className="p-2 rounded-md text-white bg-blue-500 w-1/4 mx-auto" type="submit">
            Login
          </button>
        </form>
        <div className="text-sm mt-2">TunJudge v{process.env.REACT_APP_VERSION}</div>
      </div>
    </div>
  );
});

export default Login;
