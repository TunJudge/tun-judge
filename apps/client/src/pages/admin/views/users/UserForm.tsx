import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import { useFindManyRole, useUpsertUser } from '@core/queries';

import { User } from './UsersList';

type Props = {
  user?: Partial<User>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const UserForm: FC<Props> = ({ user, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const form = useForm<User>({ defaultValues: structuredClone(user) });

  const { data: roles = [] } = useFindManyRole();
  const { mutateAsync } = useUpsertUser();

  useEffect(() => {
    form.reset(structuredClone(user));
  }, [form, user]);

  const handleSubmit = async ({ id, role, ...user }: Partial<User>) => {
    try {
      if (!user.password) delete user.password;

      const newUser = await mutateAsync({
        where: { username: user.username },
        create: user as Omit<User, 'role'>,
        update: user,
      });

      if (!newUser) return;

      toast('success', `User ${newUser?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newUser?.id);
      onClose();
    } catch (error: unknown) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} user with error: ${(error as Error).message}`,
      );
    }
  };

  return (
    <FormDialog
      className="!max-w-xl"
      open={!!user}
      form={form}
      title={`${user?.id ? 'Update' : 'Create'} User`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FormInputs.Text name="name" label="Name" placeholder="Name" autoComplete="off" required />
      <FormInputs.Email name="email" label="Email" placeholder="Email" autoComplete="email" />
      <FormInputs.Text
        name="username"
        label="Username"
        placeholder="Username"
        autoComplete="email"
        required
      />
      <FormInputs.Password
        name="password"
        label="Password"
        placeholder="Password"
        autoComplete="new-password"
        required={!user?.id}
      />
      {roles && roles.length > 0 && (
        <FormInputs.Select
          name="roleName"
          label="Role"
          placeholder="Role"
          items={roles.map((role) => ({
            id: role.name,
            label: role.description,
            value: role.name,
          }))}
          required
        />
      )}
      <FormInputs.Checkbox name="enabled" label="Enabled" defaultChecked />
    </FormDialog>
  );
};
