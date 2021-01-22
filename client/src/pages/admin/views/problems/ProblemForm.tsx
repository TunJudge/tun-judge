import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { isEmpty } from '../../../../core/helpers';
import { Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import {
  DropdownField,
  FileField,
  FormErrors,
  NumberField,
  TextField,
} from '../../../shared/extended-form';

type ProblemFormProps = {
  item: Problem;
  dismiss: () => void;
  submit: (item: Problem) => void;
};

const ProblemForm: React.FC<ProblemFormProps> = ({ item: problem, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Problem>>({
    name: isEmpty(problem.name),
    timeLimit: isEmpty(problem.timeLimit),
    file: isEmpty(problem.file),
    runScript: isEmpty(problem.runScript),
    checkScript: isEmpty(problem.checkScript),
  });
  const { data: executables } = rootStore.executablesStore;

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>{problem.id ? 'Update' : 'Create'} Problem</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <TextField<Problem>
              entity={problem}
              field="name"
              label="Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <FileField<Problem>
              entity={problem}
              field="file"
              label="Problem File"
              accept="application/pdf, text/html"
              required
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <NumberField<Problem>
              entity={problem}
              field="timeLimit"
              label="Time Limit (Seconds)"
              required
              unit="S"
              errors={errors}
              setErrors={setErrors}
            />
            <NumberField<Problem>
              entity={problem}
              field="memoryLimit"
              label="Memory Limit (Kb)"
              placeHolder="2097152"
              defaultValue={2097152}
              unit="Kb"
              errors={errors}
              setErrors={setErrors}
            />
            <NumberField<Problem>
              entity={problem}
              field="outputLimit"
              label="Output Limit (Kb)"
              placeHolder="8192"
              defaultValue={8192}
              unit="Kb"
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <DropdownField<Problem>
              entity={problem}
              field="runScript"
              label="Run Script"
              fluid
              required
              selection
              options={executables.filter((e) => e.type === 'RUNNER')}
              optionsTextField="name"
              errors={errors}
              setErrors={setErrors}
            />
            <DropdownField<Problem>
              entity={problem}
              field="checkScript"
              label="Check Script"
              fluid
              required
              selection
              options={executables.filter((e) => e.type === 'CHECKER')}
              optionsTextField="name"
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
        <Button
          color="green"
          onClick={() => submit(problem)}
          disabled={Object.values(errors).some((e) => e)}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ProblemForm;
