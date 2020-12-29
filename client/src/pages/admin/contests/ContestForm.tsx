import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Contest } from '../../../core/models';
import { isEmpty } from '../../../core/helpers';
import { CheckBoxField, DateTimeField, FormErrors, TextField } from '../../shared/extended-form';

type ContestFormProps = {
  contest: Partial<Contest>;
  dismiss: () => void;
  submit: () => void;
};

const ContestForm: React.FC<ContestFormProps> = ({ contest, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Contest>>({
    name: isEmpty(contest.name),
    shortName: isEmpty(contest.shortName),
    activateTime: isEmpty(contest.activateTime),
    startTime: isEmpty(contest.startTime),
    endTime: isEmpty(contest.endTime),
  });

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>Create Contest</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <TextField<Contest>
              entity={contest}
              field="name"
              label="Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <TextField<Contest>
              entity={contest}
              field="shortName"
              label="Short Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <DateTimeField<Contest>
              entity={contest}
              field="activateTime"
              label="Activate Time"
              required
              maxDate={contest.startTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="startTime"
              label="Start Time"
              required
              minDate={contest.activateTime}
              maxDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="endTime"
              label="End Time"
              required
              minDate={contest.startTime}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <DateTimeField<Contest>
              entity={contest}
              field="freezeTime"
              label="Freeze Time"
              minDate={contest.startTime}
              maxDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="unfreezeTime"
              label="Unfreeze Time"
              minDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
            <DateTimeField<Contest>
              entity={contest}
              field="finalizeTime"
              label="Finalize Time"
              minDate={contest.endTime}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <CheckBoxField<Contest>
              entity={contest}
              field="processBalloons"
              label="Process balloons"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Contest>
              entity={contest}
              field="public"
              label="Visible on public scoreboard"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Contest>
              entity={contest}
              field="enabled"
              label="Enabled"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
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

export default ContestForm;
