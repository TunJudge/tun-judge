import { FC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Flex, FormInputs } from 'tw-react-components';

import { version } from '../../../../../package.json';
import { useAuthContext } from '../contexts';
import { request } from '../utils';

type Credentials = {
  username: string;
  password: string;
};

export const Login: FC = () => {
  const navigate = useNavigate();
  const { connected, setLastConnectedTime } = useAuthContext();
  const loginForm = useForm<Credentials>();
  const [searchParameters] = useSearchParams();

  const login: SubmitHandler<Credentials> = async (credentials) => {
    await request('api/auth/login', 'POST', {
      body: JSON.stringify(credentials),
    });
    setLastConnectedTime(Date.now());
    navigate(searchParameters.get('returnUrl') ?? '/');
  };

  if (connected) {
    return <Navigate to={searchParameters.get('returnUrl') ?? '/'} replace />;
  }

  return (
    <Flex align="center" fullHeight>
      <Flex className="mx-8 gap-0" direction="column" align="center" fullWidth>
        <FormProvider {...loginForm}>
          <Card className="w-full bg-white sm:w-96">
            <form
              className="flex flex-col items-center gap-3"
              onSubmit={loginForm.handleSubmit(login)}
            >
              <h1 className="my-4 text-2xl font-semibold">Login</h1>
              <FormInputs.Text
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
              />
              <FormInputs.Password
                name="password"
                placeholder="Password"
                autoComplete="username"
                required
              />
              <Button className="mx-auto w-fit px-6" type="submit">
                Login
              </Button>
            </form>
          </Card>
        </FormProvider>
        <div className="mt-2 text-sm">TunJudge v{version}</div>
      </Flex>
    </Flex>
  );
};
