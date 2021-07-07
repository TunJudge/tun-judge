import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Team } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import {
  CheckBoxField,
  DropdownField,
  FormErrors,
  NumberField,
  TextAreaField,
  TextField,
} from '../../../shared/extended-form';

const TeamForm: DataTableItemForm<Team> = observer(({ item: team, isOpen, onClose, onSubmit }) => {
  const [errors, setErrors] = useState<FormErrors<Team>>({});
  const {
    usersStore: { teamUsers: users, fetchAll: fetchAllUsers },
    contestsStore: { data: contests, fetchAll: fetchAllContests },
    teamCategoriesStore: { data: categories, fetchAll: fetchAllCategories },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchAllContests(), fetchAllCategories()]);
  }, [fetchAllUsers, fetchAllContests, fetchAllCategories]);

  useEffect(() => {
    setErrors({
      name: isEmpty(team.name),
      category: isEmpty(team.category),
      user: isEmpty(team.user),
    });
  }, [team]);

  return (
    <FormModal
      title={`${team.id ? 'Update' : 'Create'} Team`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(team)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div className="grid sm:grid-cols-3 gap-2">
        <TextField<Team>
          entity={team}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <DropdownField<Team>
          entity={team}
          field="category"
          label="Category"
          required
          options={categories}
          optionsTextField="name"
          errors={errors}
          setErrors={setErrors}
        />
        <DropdownField<Team>
          entity={team}
          field="user"
          label="User"
          required
          options={users.filter((user) => !user.team || team.user?.id === user.id)}
          optionsTextField="name"
          errors={errors}
          setErrors={setErrors}
        />
      </div>
      <TextAreaField<Team>
        entity={team}
        field="members"
        label="Members"
        placeHolder="Members names..."
      />
      <div className="grid sm:grid-cols-2 gap-2">
        <NumberField<Team> entity={team} field="penalty" label="Penalty Time" defaultValue={0} />
        <TextField<Team> entity={team} field="room" label="Room" />
      </div>
      <TextAreaField<Team>
        entity={team}
        field="comments"
        label="Comments"
        placeHolder="Comments..."
      />
      <DropdownField<Team>
        entity={team}
        field="contests"
        label="Contests"
        search
        multiple
        options={contests}
        optionsTextField="name"
      />
      <CheckBoxField<Team> entity={team} field="enabled" label="Enabled" defaultValue={true} />
    </FormModal>
  );
});

export default TeamForm;
