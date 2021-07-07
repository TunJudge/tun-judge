import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Language } from '../../../../core/models';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import {
  CheckBoxField,
  DropdownField,
  FileField,
  FormErrors,
  TextField,
} from '../../../shared/extended-form';

const LanguageForm: DataTableItemForm<Language> = ({
  item: language,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<FormErrors<Language>>({});

  useEffect(() => {
    setErrors({
      name: isEmpty(language.name),
      dockerImage: isEmpty(language.dockerImage),
      buildScript: isEmpty(language.buildScript),
      extensions: isEmpty(language.extensions),
    });
  }, [language]);

  return (
    <FormModal
      title={`${language.id ? 'Update' : 'Create'} Language`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(language)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div className="grid sm:grid-cols-3 gap-2">
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
      </div>
      <DropdownField<Language>
        entity={language}
        field="extensions"
        label="File Extensions"
        search
        multiple
        required
        allowAdditions
        errors={errors}
        setErrors={setErrors}
      />
      <div className="grid sm:grid-cols-2 gap-2">
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
      </div>
    </FormModal>
  );
};

export default LanguageForm;
