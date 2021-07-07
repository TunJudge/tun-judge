import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { User } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import { CheckBoxField, DropdownField, FormErrors, TextField } from '../../../shared/extended-form';

const UserForm: DataTableItemForm<User> = observer(({ item: user, isOpen, onClose, onSubmit }) => {
  const [errors, setErrors] = useState<FormErrors<User>>({});

  const { roles, fetchAllRoles } = rootStore.usersStore;

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
      <div className="grid sm:grid-cols-2 gap-2">
        <TextField<User>
          entity={user}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <TextField<User> entity={user} field="email" type="email" label="Email" />
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
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
        <DropdownField<User>
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
      <CheckBoxField<User> entity={user} field="enabled" label="Enabled" defaultValue={true} />
    </FormModal>
  );
});

export default UserForm;
