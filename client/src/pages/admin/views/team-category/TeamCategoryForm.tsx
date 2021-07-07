import React, { useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { TeamCategory } from '../../../../core/models';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import { CheckBoxField, FormErrors, TextField } from '../../../shared/extended-form';

const TeamCategoryForm: DataTableItemForm<TeamCategory> = ({
  item: teamCategory,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<FormErrors<TeamCategory>>({
    name: isEmpty(teamCategory.name),
  });

  return (
    <FormModal
      title={`${teamCategory.id ? 'Update' : 'Create'} Team Category`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(teamCategory)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div className="grid sm:grid-cols-5 gap-2">
        <TextField<TeamCategory>
          entity={teamCategory}
          field="name"
          label="Name"
          required
          width="3"
          errors={errors}
          setErrors={setErrors}
        />
        <TextField<TeamCategory>
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
      <CheckBoxField<TeamCategory>
        entity={teamCategory}
        field="visible"
        label="Visible"
        defaultValue={true}
      />
    </FormModal>
  );
};
export default TeamCategoryForm;
