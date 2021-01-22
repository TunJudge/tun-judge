import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { isEmpty } from '../../../../core/helpers';
import { Language } from '../../../../core/models';
import {
  CheckBoxField,
  DropdownField,
  FileField,
  FormErrors,
  TextField,
} from '../../../shared/extended-form';

type LanguageFormProps = {
  item: Language;
  dismiss: () => void;
  submit: (item: Language) => void;
};

const LanguageForm: React.FC<LanguageFormProps> = ({ item: language, dismiss, submit }) => {
  const [errors, setErrors] = useState<FormErrors<Language>>({
    name: isEmpty(language.name),
    dockerImage: isEmpty(language.dockerImage),
    buildScript: isEmpty(language.buildScript),
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
            <TextField<Language>
              entity={language}
              field="dockerImage"
              label="Docker Image"
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
        <Button
          color="green"
          onClick={() => submit(language)}
          disabled={Object.values(errors).some((e) => e)}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default LanguageForm;
