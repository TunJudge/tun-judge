import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import { useUpsertTeamCategory } from '@core/queries';

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
      className="!max-w-xl"
      open={!!teamCategory}
      form={form}
      title={`${teamCategory?.id ? 'Update' : 'Create'} Team Category`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FormInputs.Text
        name="name"
        label="Name"
        placeholder="Name"
        autoComplete="off"
        required
        width="3"
      />
      <FormInputs.Text
        name="color"
        label="Color"
        placeholder="#000000"
        width="2"
        required
        pattern={/(#[0-9a-fA-F]{6})*/}
      />
      <FormInputs.Checkbox
        name="visible"
        label="Visible"
        description="Whether the teams under this category will be visible in the public scoreboard?"
        defaultChecked={true}
      />
    </FormDialog>
  );
};
