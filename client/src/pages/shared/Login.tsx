import React, { useState } from 'react';
import { Form, Grid, Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import http from '../../core/utils/http-client';

const Login: React.FC = observer(() => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const login = async () => {
    try {
      await http.post('api/auth/login', { username, password });
      localStorage.setItem('connected', `${Date.now()}`);
      window.location.assign('/');
    } catch (e) {}
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="blue" textAlign="center">
          Please sign-in
        </Header>
        <Form onSubmit={login}>
          <Segment stacked>
            <Form.Input
              fluid
              autoFocus
              icon="user"
              value={username}
              iconPosition="left"
              placeholder="Username"
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              type="password"
              value={password}
              iconPosition="left"
              placeholder="Password"
              autoComplete="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Button color="blue" size="large" fluid>
              Login
            </Form.Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
});

export default Login;
