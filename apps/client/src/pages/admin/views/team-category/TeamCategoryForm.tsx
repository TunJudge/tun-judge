import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import { useUpsertTeamCategory } from '@models';

import { TeamCategory } from './TeamCategoriesList';

type Props = {
  teamCategory?: Partial<TeamCategory>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const TeamCategoryForm: FC<Props> = ({ teamCategory, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const form = useForm<TeamCategory>({ defaultValues: structuredClone(teamCategory) });

  const { mutateAsync } = useUpsertTeamCategory();

  useEffect(() => {
    form.reset(teamCategory);
  }, [form, teamCategory]);

  const handleSubmit = async ({ id, teams: _, ...teamCategory }: TeamCategory) => {
    try {
      const newTeamCategory = await mutateAsync({
        where: { id },
        create: teamCategory,
        update: teamCategory,
      });

      if (!newTeamCategory) return;

      toast('success', `Team category ${newTeamCategory?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newTeamCategory?.id);
      onClose();
    } catch (error: any) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} team category with error: ${error.message}`,
      );
    }
  };

  return (
    <FormDialog
      className="!max-w-4xl"
      open={!!teamCategory}
      form={form}
      title={`${teamCategory?.id ? 'Update' : 'Create'} Team Category`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Flex direction="column">
        <Flex fullWidth>
          <FormInputs.Text name="name" label="Name" placeholder="Name" required width="3" />
          <FormInputs.Text
            name="color"
            label="Color"
            placeholder="#000000"
            width="2"
            required
            pattern={/(#[0-9a-fA-F]{6})*/}
          />
        </Flex>
        <FormInputs.Checkbox
          name="visible"
          label="Visible"
          description="Whether the teams under this category will be visible in the public scoreboard?"
          defaultChecked={true}
        />
      </Flex>
    </FormDialog>
  );
};
