import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Contest, Team, TeamCategory, User } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import CheckBoxInput from '../../../shared/form-controls/CheckBoxInput';
import DropDownInput from '../../../shared/form-controls/DropDownInput';
import NumberInput from '../../../shared/form-controls/NumberInput';
import TextareaInput from '../../../shared/form-controls/TextareaInput';
import TextInput from '../../../shared/form-controls/TextInput';
import { FormErrors } from '../../../shared/form-controls/types';

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
      users: isEmpty(team.users),
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
      <div className="grid sm:grid-cols-2 gap-2">
        <TextInput<Team>
          entity={team}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <DropDownInput<Team, TeamCategory>
          entity={team}
          field="category"
          label="Category"
          required
          options={categories}
          optionsTextField="name"
          errors={errors}
          setErrors={setErrors}
        />
      </div>
      <DropDownInput<Team, User>
        entity={team}
        field="users"
        label="Members"
        search
        multiple
        required
        options={users.filter(
          (user) =>
            !user.team || team.users?.some((t) => t.id === user.id) || user.team.id === team.id
        )}
        optionsTextField="name"
        errors={errors}
        setErrors={setErrors}
        onUnselect={(unselected) => {
          const user = users.find((user) => user.id === unselected.id);
          if (user) user.team = undefined;
        }}
      />
      <div className="grid sm:grid-cols-2 gap-2">
        <NumberInput<Team> entity={team} field="penalty" label="Penalty Time" defaultValue={0} />
        <TextInput<Team> entity={team} field="room" label="Room" />
      </div>
      <TextareaInput<Team>
        entity={team}
        field="comments"
        label="Comments"
        placeHolder="Comments..."
      />
      <DropDownInput<Team, Contest>
        entity={team}
        field="contests"
        label="Contests"
        search
        multiple
        options={contests}
        optionsTextField="name"
      />
      <CheckBoxInput<Team> entity={team} field="enabled" label="Enabled" defaultValue={true} />
    </FormModal>
  );
});

export default TeamForm;
