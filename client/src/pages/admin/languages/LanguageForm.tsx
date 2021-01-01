import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { Language } from '../../../core/models';
import { isEmpty } from '../../../core/helpers';
import {
  CheckBoxField,
  DropdownField,
  FileField,
  FormErrors,
  TextField,
} from '../../shared/extended-form';

type LanguageFormProps = {
  language: Language;
  dismiss: () => void;
  submit: () => void;
};

const LanguageForm: React.FC<LanguageFormProps> = ({ language, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Language>>({
    name: isEmpty(language.name),
    buildScript: isEmpty(language.buildScript),
    runScript: isEmpty(language.runScript),
  });

  return (
    <Modal open onClose={dismiss} closeOnEscape={false}>
      <Modal.Header>{language.id ? 'Update' : 'Create'} Language</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <TextField<Language>
              entity={language}
              field="name"
              label="Name"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <FileField<Language>
              entity={language}
              field="buildScript"
              label="Build Script"
              required
              errors={errors}
              setErrors={setErrors}
            />
            <FileField<Language>
              entity={language}
              field="runScript"
              label="Run Script"
              required
              errors={errors}
              setErrors={setErrors}
            />
          </Form.Group>
          <DropdownField<Language>
            entity={language}
            field="extensions"
            label="File Extensions"
            fluid
            search
            multiple
            selection
            allowAdditions
          />
          <Form.Group widths="equal">
            <CheckBoxField<Language>
              entity={language}
              field="allowJudge"
              label="Allow Judge"
              defaultValue={true}
              errors={errors}
              setErrors={setErrors}
            />
            <CheckBoxField<Language>
              entity={language}
              field="allowSubmit"
              label="Allow Submit"
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

export default LanguageForm;
