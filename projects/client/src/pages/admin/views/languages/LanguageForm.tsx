import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Language } from '../../../../core/models';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import CheckBoxInput from '../../../shared/form-controls/CheckBoxInput';
import DropDownInput from '../../../shared/form-controls/DropDownInput';
import FileInput from '../../../shared/form-controls/FileInput';
import TextInput from '../../../shared/form-controls/TextInput';
import { FormErrors } from '../../../shared/form-controls/types';

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
        <TextInput<Language>
          entity={language}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <TextInput<Language>
          entity={language}
          field="dockerImage"
          label="Docker Image"
          description="Docker image to process any submission sent with this language"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <FileInput<Language>
          entity={language}
          field="buildScript"
          label="Build Script"
          description="The script responsible for build a code source of this language"
          required
          errors={errors}
          setErrors={setErrors}
        />
      </div>
      <DropDownInput<Language, string>
        entity={language}
        field="extensions"
        label="File Extensions"
        description="Possible file extensions for this language"
        search
        multiple
        required
        allowAdditions
        errors={errors}
        setErrors={setErrors}
      />
      <div className="grid sm:grid-cols-2 gap-2">
        <CheckBoxInput<Language>
          entity={language}
          field="allowJudge"
          label="Allow Judge"
          description="Whether to allow judges hosts to pull any submission sent with this language"
          defaultValue={true}
          errors={errors}
          setErrors={setErrors}
        />
        <CheckBoxInput<Language>
          entity={language}
          field="allowSubmit"
          label="Allow Submit"
          description="Whether to allow teams submit with this language"
          defaultValue={true}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </FormModal>
  );
};

export default LanguageForm;
