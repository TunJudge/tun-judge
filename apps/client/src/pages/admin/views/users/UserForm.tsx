import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { isEmpty } from '@core/helpers';
import { Role, User } from '@core/models';
import { UsersStore, useStore } from '@core/stores';
import { DataTableItemForm } from '@shared/data-table/DataTable';
import { FormModal } from '@shared/dialogs';
import CheckBoxInput from '@shared/form-controls/CheckBoxInput';
import DropDownInput from '@shared/form-controls/DropDownInput';
import TextInput from '@shared/form-controls/TextInput';
import { FormErrors } from '@shared/form-controls/types';

const UserForm: DataTableItemForm<User> = observer(({ item: user, isOpen, onClose, onSubmit }) => {
  const { roles, fetchAllRoles } = useStore<UsersStore>('usersStore');

  const [errors, setErrors] = useState<FormErrors<User>>({});

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  useEffect(() => {
    setErrors({
      name: isEmpty(user.name),
      username: isEmpty(user.username),
      role: isEmpty(user.role),
    });
  }, [user]);

  return (
    <FormModal
      title={`${user.id ? 'Update' : 'Create'} User`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(user)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <TextInput<User>
          entity={user}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <TextInput<User> entity={user} field="email" type="email" label="Email" />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <TextInput<User>
          entity={user}
          field="username"
          label="Username"
          autoComplete="email"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <TextInput<User>
          entity={user}
          field="password"
          type="password"
          label="Password"
          autoComplete="new-password"
        />
        <DropDownInput<User, Role>
          entity={user}
          field="role"
          label="Role"
          required
          options={roles}
          optionsIdField="name"
          optionsTextField="description"
          errors={errors}
          setErrors={setErrors}
        />
      </div>
      <CheckBoxInput<User> entity={user} field="enabled" label="Enabled" defaultValue={true} />
    </FormModal>
  );
});

export default UserForm;
