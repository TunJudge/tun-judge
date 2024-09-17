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

  const { data: users = [] } = useFindManyUser();
  const { data: categories = [] } = useFindManyTeamCategory();
  const { data: contests = [] } = useFindManyContest();
  const { mutateAsync } = useUpsertTeam();

  useEffect(() => {
    form.reset(team);
  }, [form, team]);

  // useEffect(() => {
  //   setErrors({
  //     name: isEmpty(team.name),
  //     category: isEmpty(team.category),
  //     users: isEmpty(team.users),
  //   });
  // }, [team]);

  const handleSubmit = async ({
    id,
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
            selectPredicate={(category) => category.id === team?.category?.id}
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
                team?.users?.some((t) => t.id === user.id) ||
                user.teamId === team?.id,
            )
            .map((user) => ({
              id: user.id,
              label: user.username,
              value: user,
            }))}
          selectPredicate={(user) => team?.users?.some((t) => t.id === user.id) ?? false}
        />
        <Flex fullWidth>
          <FormInputs.Number
            name="penalty"
            label="Penalty Time"
            placeholder="Penalty Time"
            defaultValue={0}
          />
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
          selectPredicate={(contest) =>
            team?.contests?.some((c) => c.contestId === contest.contestId) ?? false
          }
        />
        <FormInputs.Checkbox name="enabled" label="Enabled" defaultChecked={true} />
      </Flex>
    </FormDialog>
  );
};
