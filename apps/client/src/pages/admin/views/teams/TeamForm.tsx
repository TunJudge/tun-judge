import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import {
  useFindManyContest,
  useFindManyTeamCategory,
  useFindManyUser,
  useUpsertTeam,
} from '@models';

import { Team } from './TeamsList';

type Props = {
  team?: Partial<Team>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const TeamForm: FC<Props> = ({ team, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const form = useForm<Team>({ defaultValues: structuredClone(team) });

  const { data: users = [] } = useFindManyUser({ include: { team: true } });
  const { data: categories = [] } = useFindManyTeamCategory();
  const { data: contests = [] } = useFindManyContest();
  const { mutateAsync } = useUpsertTeam();

  useEffect(() => {
    form.reset(structuredClone(team));
  }, [form, team]);

  const handleSubmit = async ({
    id = -1,
    category,
    categoryId: _,
    users = [],
    contests = [],
    ...team
  }: Team) => {
    try {
      const newTeam = await mutateAsync({
        where: { id },
        create: {
          ...team,
          category: { connect: { id: category.id } },
          users: { connect: users.map(({ id }) => ({ id })) },
          contests: { createMany: { data: contests } },
        },
        update: {
          ...team,
          category: { connect: { id: category.id } },
          users: { set: users.map(({ id }) => ({ id })) },
          // contests: { set: contests },
        },
      });

      if (!newTeam) return;

      toast('success', `Team ${newTeam?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newTeam?.id);
      onClose();
    } catch (error: any) {
      toast('error', `Failed to ${id ? 'update' : 'create'} team with error: ${error.message}`);
    }
  };

  return (
    <FormDialog
      className="!max-w-4xl"
      open={!!team}
      form={form}
      title={`${team?.id ? 'Update' : 'Create'} Team`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Flex direction="column">
        <Flex fullWidth>
          <FormInputs.Text name="name" label="Name" placeholder="Name" required />
          <FormInputs.Select
            name="category"
            label="Category"
            placeholder="Category"
            required
            items={categories.map((category) => ({
              id: category.id,
              label: category.name,
              value: category,
            }))}
            selectPredicate={(category) => category.id === form.getValues('category.id')}
          />
        </Flex>
        <FormInputs.Select
          name="users"
          label="Members"
          placeholder="Members"
          search
          multiple
          required
          items={users
            .filter(
              (user) =>
                !user.teamId ||
                user.teamId === team?.id ||
                form.getValues('users')?.some((t) => t.id === user.id),
            )
            .map((user) => ({
              id: user.id,
              label: user.username,
              value: user,
            }))}
          selectPredicate={(a, b) => a.id === b.id}
        />
        <Flex fullWidth>
          <FormInputs.Number name="penalty" label="Penalty Time" placeholder="Penalty Time" />
          <FormInputs.Text name="room" label="Room" placeholder="Room" />
        </Flex>
        <FormInputs.Textarea name="comments" label="Comments" placeholder="Comments" />
        <FormInputs.Select
          name="contests"
          label="Contests"
          placeholder="Contests"
          search
          multiple
          items={contests.map((contest) => ({
            id: contest.id,
            label: contest.name,
            value: { contestId: contest.id },
          }))}
          selectPredicate={(a, b) => a.contestId === b.contestId}
        />
        <FormInputs.Checkbox name="enabled" label="Enabled" />
      </Flex>
    </FormDialog>
  );
};
