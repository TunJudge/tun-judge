import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormDialog, FormInputs } from 'tw-react-components';

import { User, useToastContext } from '@core/contexts';
import { useFindManyRole, useUpsertUser } from '@models';

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
    form.reset(user);
  }, [form, user]);

  const handleSubmit = async ({ id, role, ...user }: Partial<User>) => {
    try {
      const newUser = await mutateAsync({
        where: { username: user.username },
        create: user as Omit<User, 'role'>,
        update: user,
      });

      if (!newUser) return;

      toast('success', `User ${newUser?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newUser?.id);
      onClose();
    } catch (error: any) {
      toast('error', `Failed to ${id ? 'update' : 'create'} user with error: ${error.message}`);
    }
  };

  // const [errors, setErrors] = useState<FormErrors<User>>({});

  // useEffect(() => {
  //   setErrors({
  //     name: isEmpty(user?.name),
  //     username: isEmpty(user?.username),
  //     role: isEmpty(user?.role),
  //   });
  // }, [user]);

  return (
    <FormDialog
      className="!max-w-4xl"
      open={!!user}
      form={form}
      title={`${user?.id ? 'Update' : 'Create'} User`}
      onSubmit={handleSubmit}
      onClose={onClose}
      // submitDisabled={Object.values(errors).some((e) => e)}
    >
      <Flex direction="column">
        <Flex fullWidth>
          <FormInputs.Text name="name" label="Name" placeholder="Name" required />
          <FormInputs.Email name="email" label="Email" placeholder="Email" />
        </Flex>
        <Flex fullWidth>
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
        </Flex>
        <FormInputs.Checkbox name="enabled" label="Enabled" defaultChecked />
      </Flex>
    </FormDialog>
  );
};
