import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { User } from '../../../core/models';
import { isEmpty } from '../../../core/helpers';
import { CheckBoxField, FormErrors, TextField } from '../../shared/extended-form';
import { rootStore } from '../../../core/stores/RootStore';

type UserFormProps = {
  user: User;
  dismiss: () => void;
  submit: () => void;
};

const UserForm: React.FC<UserFormProps> = ({ user, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<User>>({
    name: isEmpty(user.name),
    username: isEmpty(user.username),
    role: isEmpty(user.role),
  });

  const { roles } = rootStore.usersStore;

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>{user.id ? 'Update' : 'Create'} User</Modal.Header>
      <Modal.Content>
        <Form>
          <input type="hidden" value="" />
          <Form.Group widths="equal">
            <TextField<User>
              entity={user}
              field="name"
              label="Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <TextField<User>
              entity={user}
              field="username"
              label="Username"
              autoComplete="email"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <TextField<User>
              entity={user}
              field="password"
              type="password"
              label="Password"
              autoComplete="new-password"
            />
          </Form.Group>
          <Form.Group widths="equal">
            <TextField<User> entity={user} field="email" type="email" label="Email" />
            <Form.Dropdown
              placeholder="Role"
              selection
              required
              label="Role"
              error={errors.role}
              defaultValue={user.role?.name}
              options={roles.map((role) => ({
                key: role.name,
                text: role.description,
                value: role.name,
              }))}
              onChange={(_, { value }) => {
                user.role = roles.find((role) => role.name === value)!;
                setErrors({ ...errors, role: false });
              }}
            />
          </Form.Group>
          <CheckBoxField<User> entity={user} field="enabled" label="Enabled" defaultValue={true} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button color="green" onClick={submit} disabled={Object.values(errors).some((e) => e)}>
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UserForm;
