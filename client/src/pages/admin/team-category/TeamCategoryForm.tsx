import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { TeamCategory } from '../../../core/models';
import { isEmpty } from '../../../core/helpers';
import { CheckBoxField, FormErrors, TextField } from '../../shared/extended-form';
import { observer } from 'mobx-react';

type TeamCategoryFormProps = {
  teamCategory: TeamCategory;
  dismiss: () => void;
  submit: () => void;
};

const TeamCategoryForm: React.FC<TeamCategoryFormProps> = observer(
  ({ teamCategory, dismiss, submit }) => {
    const [errors, setErrors] = useState<FormErrors<TeamCategory>>({
      name: isEmpty(teamCategory.name),
    });

    return (
      <Modal open onClose={dismiss} closeOnEscape={false} size="tiny">
        <Modal.Header>{teamCategory.id ? 'Update' : 'Create'} Team Category</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              <TextField<TeamCategory>
                entity={teamCategory}
                field="name"
                label="Name"
                required
                width="12"
                errors={errors}
                setErrors={setErrors}
              />
              <TextField<TeamCategory>
                entity={teamCategory}
                field="color"
                label="Color"
                placeHolder="#666666"
                pattern="(#[0-9a-fA-F]{6})*"
                width="4"
                errors={errors}
                setErrors={setErrors}
              />
            </Form.Group>
            <CheckBoxField<TeamCategory>
              entity={teamCategory}
              field="visible"
              label="Visible"
              defaultValue={true}
            />
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
  },
);
export default TeamCategoryForm;
