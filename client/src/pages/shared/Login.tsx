import { observer } from 'mobx-react';
import qs from 'querystring';
import React, { FormEvent, useState } from 'react';
import http from '../../core/utils/http-client';

const Login: React.FC = observer(() => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const login = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await http.post('api/auth/login', { username, password });
      localStorage.setItem('connected', `${Date.now()}`);
      const { returnUrl } = qs.parse(location.search.substr(1));
      window.location.assign((returnUrl as string) ?? '/');
    } catch (e) {}
  };
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center w-full mx-4 sm:w-1/2 md:w-1/3 sm:mx-0">
        <div className="text-3xl text-gray-900 mb-4">Sign-in</div>
        <form className="p-5 rounded-lg border bg-white w-full" onSubmit={login}>
          <input
            className="mb-3 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            type="text"
            autoFocus
            value={username}
            placeholder="Username"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="mb-3 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            type="password"
            value={password}
            placeholder="Password"
            autoComplete="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="p-2 rounded-md text-white bg-blue-500 w-full" type="submit">
            Login
          </button>
        </form>
        <div className="text-sm mt-2">TunJudge v{process.env.REACT_APP_VERSION}</div>
      </div>
    </div>
  );
});

export default Login;
