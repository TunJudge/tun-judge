import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Executable } from '../../../../core/models';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import {
  CheckBoxField,
  DropdownField,
  FileField,
  FormErrors,
  TextField,
} from '../../../shared/extended-form';

const ExecutableForm: DataTableItemForm<Executable> = ({
  item: executable,
  isOpen,
  onClose,
  submit,
}) => {
  const [errors, setErrors] = useState<FormErrors<Executable>>({
    name: isEmpty(executable.name),
    type: isEmpty(executable.type),
    file: isEmpty(executable.file),
  });

  useEffect(() => {
    if (executable.type === 'RUNNER') {
      setErrors({
        name: isEmpty(executable.name),
        type: isEmpty(executable.type),
        file: isEmpty(executable.file),
        dockerImage: false,
        buildScript: false,
      });
    } else if (executable.type === 'CHECKER') {
      setErrors({
        name: isEmpty(executable.name),
        type: isEmpty(executable.type),
        file: isEmpty(executable.file),
        dockerImage: isEmpty(executable.dockerImage),
        buildScript: isEmpty(executable.buildScript),
      });
    }
  }, [executable]);

  return (
    <FormModal
      title={`${executable.id ? 'Update' : 'Create'} Executable`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => submit(executable)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div className={`grid sm:grid-cols-${executable.type === 'CHECKER' ? '3' : '2'} gap-2`}>
        <TextField<Executable>
          entity={executable}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <TextField<Executable> entity={executable} field="description" label="Description" />
        {executable.type === 'CHECKER' && (
          <TextField<Executable>
            entity={executable}
            field="dockerImage"
            label="Docker Image"
            required
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <DropdownField<Executable>
          entity={executable}
          field="type"
          label="Type"
          required
          options={['RUNNER', 'CHECKER']}
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
      </div>
      <CheckBoxField<Executable>
        entity={executable}
        field="default"
        label="Default"
        defaultValue={false}
      />
    </FormModal>
  );
};

export default ExecutableForm;
