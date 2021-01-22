import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { isEmpty } from '../../../../core/helpers';
import { Executable } from '../../../../core/models';
import {
  CheckBoxField,
  DropdownField,
  FileField,
  FormErrors,
  TextField,
} from '../../../shared/extended-form';

type ExecutableFormProps = {
  item: Executable;
  dismiss: () => void;
  submit: (item: Executable) => void;
};

const ExecutableForm: React.FC<ExecutableFormProps> = ({ item: executable, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Executable>>({
    name: isEmpty(executable.name),
    type: isEmpty(executable.type),
    file: isEmpty(executable.file),
  });

  useEffect(() => {
    if (executable.type === 'RUNNER') {
      setErrors((errors) => ({ ...errors, dockerImage: false, buildScript: false }));
    } else if (executable.type === 'CHECKER') {
      setErrors((errors) => ({
        ...errors,
        dockerImage: isEmpty(executable.dockerImage),
        buildScript: isEmpty(executable.buildScript),
      }));
    }
  }, [executable.type, executable.buildScript, executable.dockerImage]);

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>{executable.id ? 'Update' : 'Create'} Executable</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <TextField<Executable>
              entity={executable}
              field="name"
              label="Name"
              width="4"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <TextField<Executable>
              entity={executable}
              field="description"
              label="Description"
              width="7"
            />
            {executable.type === 'CHECKER' && (
              <TextField<Executable>
                entity={executable}
                field="dockerImage"
                label="Docker Image"
                width="4"
                required
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </Form.Group>
          <Form.Group widths="equal">
            <DropdownField<Executable>
              entity={executable}
              field="type"
              label="Type"
              fluid
              selection
              options={[
                { id: 'RUNNER', text: 'Runner' },
                { id: 'CHECKER', text: 'Checker' },
              ]}
              optionsTextField="text"
              errors={errors}
              setErrors={setErrors}
            />
            <FileField<Executable>
              entity={executable}
              field="file"
              label="Source File"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <FileField<Executable>
              entity={executable}
              field="buildScript"
              label="Build Script"
              required={executable.type === 'CHECKER'}
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <CheckBoxField<Executable>
            entity={executable}
            field="default"
            label="Default"
            defaultValue={false}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={() => submit(executable)}
          disabled={Object.values(errors).some((e) => e)}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ExecutableForm;
