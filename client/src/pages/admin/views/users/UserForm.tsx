import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { isEmpty } from '../../../../core/helpers';
import { User } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { CheckBoxField, DropdownField, FormErrors, TextField } from '../../../shared/extended-form';

type UserFormProps = {
  item: User;
  dismiss: () => void;
  submit: (item: User) => void;
};

const UserForm: React.FC<UserFormProps> = ({ item: user, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<User>>({
    name: isEmpty(user.name),
    username: isEmpty(user.username),
    role: isEmpty(user.role),
  });

  const { roles, fetchAllRoles } = rootStore.usersStore;

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

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
            <DropdownField<User>
              entity={user}
              field="role"
              label="Role"
              fluid
              required
              selection
              options={roles}
              optionsIdField="name"
              optionsTextField="description"
              isObject
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <CheckBoxField<User> entity={user} field="enabled" label="Enabled" defaultValue={true} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={() => submit(user)}
          disabled={Object.values(errors).some((e) => e)}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UserForm;
