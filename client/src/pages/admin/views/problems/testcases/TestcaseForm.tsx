import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Testcase } from '../../../../../core/models';
import { isEmpty } from '../../../../../core/helpers';
import { FileField, FormErrors, TextField } from '../../../../shared/extended-form';

type TestcaseFormProps = {
  open: boolean;
  testcase: Partial<Testcase>;
  dismiss: () => void;
  submit: () => void;
};

const TestcaseForm: React.FC<TestcaseFormProps> = ({ open, testcase, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Testcase>>({
    input: isEmpty(testcase.id) && isEmpty(testcase.input),
    output: isEmpty(testcase.id) && isEmpty(testcase.output),
  });

  return (
    <Modal open={open} onClose={dismiss} closeOnEscape={false} size="small">
      <Modal.Header>{testcase.id ? 'Update' : 'Create'} Testcase</Modal.Header>
      <Modal.Content>
        <Form onSubmit={Object.values(errors).some((e) => e) ? undefined : submit}>
          <Form.Group widths="equal">
            <FileField<Testcase>
              entity={testcase}
              field="input"
              label="Input File"
              placeHolder="*.in"
              accept=".in"
              errors={errors}
              setErrors={setErrors}
            />
            <Form.Input
              label="Input File MD5"
              placeholder="Input File MD5"
              value={testcase.input?.md5Sum ?? ''}
              readOnly
            />
          </Form.Group>
          <Form.Group widths="equal">
            <FileField<Testcase>
              entity={testcase}
              field="output"
              label="Output File"
              placeHolder="*.ans"
              accept=".ans"
              errors={errors}
              setErrors={setErrors}
            />
            <Form.Input
              label="Output File MD5"
              placeholder="Output File MD5"
              value={testcase.output?.md5Sum ?? ''}
              readOnly
            />
          </Form.Group>
          <TextField<Testcase> entity={testcase} field="description" label="Description" />
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

export default TestcaseForm;
