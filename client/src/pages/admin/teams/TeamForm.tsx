import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Contest, Team, TeamCategory, User } from '../../../core/models';
import { isEmpty } from '../../../core/helpers';
import {
  CheckBoxField,
  FormErrors,
  NumberField,
  TextAreaField,
  TextField,
} from '../../shared/extended-form';

type TeamFormProps = {
  team: Team;
  users: User[];
  contests: Contest[];
  categories: TeamCategory[];
  dismiss: () => void;
  submit: () => void;
};

const TeamForm: React.FC<TeamFormProps> = ({
  team,
  users,
  contests,
  categories,
  dismiss,
  submit,
}) => {
  const [errors, setErrors] = useState<FormErrors<Team>>({
    name: isEmpty(team.name),
    category: isEmpty(team.category),
  });

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
            <Form.Dropdown
              required
              selection
              label="Category"
              placeholder="Category"
              error={errors.category}
              defaultValue={team.category?.id}
              options={categories.map((role) => ({
                key: role.id,
                text: role.name,
                value: role.id,
              }))}
              onChange={(_, { value }) => {
                team.category = categories.find((category) => category.id === value)!;
                setErrors({ ...errors, category: false });
              }}
            />
            <Form.Dropdown
              selection
              label="User"
              placeholder="User"
              defaultValue={team.user?.id}
              options={users
                .filter((user) => !user.team || (team.user && team.user.id === user.id))
                .map((user) => ({
                  key: user.id,
                  text: user.name,
                  value: user.id,
                }))}
              onChange={(_, { value }) => (team.user = users.find((c) => c.id === value)!)}
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
          <Form.Dropdown
            search
            multiple
            selection
            label="Contests"
            placeholder="Contests"
            defaultValue={team.contests?.map((contest) => contest.id)}
            options={contests.map((contest) => ({
              key: contest.id,
              text: contest.name,
              value: contest.id,
            }))}
            onChange={(_, { value }) =>
              (team.contests = (value as number[]).map((v) => contests.find((c) => c.id === v)!))
            }
          />
          <CheckBoxField<Team> entity={team} field="enabled" label="Enabled" defaultValue={true} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button color="green" onClick={submit} disabled={Object.values(errors).some((e) => e)}>
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default TeamForm;
