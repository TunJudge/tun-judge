import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Team } from '../../../../core/models';
import { isEmpty } from '../../../../core/helpers';
import {
  CheckBoxField,
  DropdownField,
  FormErrors,
  NumberField,
  TextAreaField,
  TextField,
} from '../../../shared/extended-form';
import { rootStore } from '../../../../core/stores/RootStore';

type TeamFormProps = {
  item: Team;
  dismiss: () => void;
  submit: (item: Team) => void;
};

const TeamForm: React.FC<TeamFormProps> = ({ item: team, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Team>>({
    name: isEmpty(team.name),
    category: isEmpty(team.category),
  });
  const {
    usersStore: { teamUsers: users },
    contestsStore: { data: contests },
    teamCategoriesStore: { data: categories },
  } = rootStore;

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>{team.id ? 'Update' : 'Create'} Team</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
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
              fluid
              selection
              options={categories}
              optionsTextField="name"
              isObject
              errors={errors}
              setErrors={setErrors}
            />
            <DropdownField<Team>
              entity={team}
              field="user"
              label="User"
              fluid
              selection
              options={users.filter(
                (user) => !user.team || (team.user && team.user.id === user.id),
              )}
              optionsTextField="name"
              isObject
            />
          </Form.Group>
          <TextAreaField<Team>
            entity={team}
            field="members"
            label="Members"
            placeHolder="Members names..."
          />
          <Form.Group widths="equal">
            <NumberField<Team>
              entity={team}
              field="penalty"
              label="Penalty Time"
              defaultValue={0}
            />
            <TextField<Team> entity={team} field="room" label="Room" />
          </Form.Group>
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
            fluid
            multiple
            selection
            options={contests}
            optionsTextField="name"
            isObject
          />
          <CheckBoxField<Team> entity={team} field="enabled" label="Enabled" defaultValue={true} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={() => submit(team)}
          disabled={Object.values(errors).some((e) => e)}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default TeamForm;
