import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { TeamCategory } from '../../../../core/models';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import CheckBoxInput from '../../../shared/form-controls/CheckBoxInput';
import TextInput from '../../../shared/form-controls/TextInput';
import { FormErrors } from '../../../shared/form-controls/types';

const TeamCategoryForm: DataTableItemForm<TeamCategory> = ({
  item: teamCategory,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<FormErrors<TeamCategory>>({});

  useEffect(() => {
    setErrors({
      name: isEmpty(teamCategory.name),
    });
  }, [teamCategory]);

  return (
    <FormModal
      title={`${teamCategory.id ? 'Update' : 'Create'} Team Category`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(teamCategory)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div className="grid sm:grid-cols-5 gap-2">
        <TextInput<TeamCategory>
          entity={teamCategory}
          field="name"
          label="Name"
          required
          width="3"
          errors={errors}
          setErrors={setErrors}
        />
        <TextInput<TeamCategory>
          entity={teamCategory}
          field="color"
          label="Color"
          width="2"
          required
          placeHolder="#666666"
          pattern="(#[0-9a-fA-F]{6})*"
          errors={errors}
          setErrors={setErrors}
        />
      </div>
      <CheckBoxInput<TeamCategory>
        entity={teamCategory}
        field="visible"
        label="Visible"
        description="Whether the teams under this category will be visible in the public scoreboard?"
        defaultValue={true}
      />
    </FormModal>
  );
};
export default TeamCategoryForm;
