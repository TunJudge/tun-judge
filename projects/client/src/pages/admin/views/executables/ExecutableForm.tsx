import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { isEmpty } from '@core/helpers';
import { Executable, ExecutableType } from '@core/models';

import { DataTableItemForm } from '@shared/data-table/DataTable';
import { FormModal } from '@shared/dialogs';
import CheckBoxInput from '@shared/form-controls/CheckBoxInput';
import DropDownInput from '@shared/form-controls/DropDownInput';
import FileInput from '@shared/form-controls/FileInput';
import TextInput from '@shared/form-controls/TextInput';
import { FormErrors } from '@shared/form-controls/types';

const ExecutableForm: DataTableItemForm<Executable> = ({
  item: executable,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<FormErrors<Executable>>({
    name: isEmpty(executable.name),
    type: isEmpty(executable.type),
    sourceFile: isEmpty(executable.sourceFile),
  });

  useEffect(() => {
    if (executable.type === 'RUNNER') {
      setErrors({
        name: isEmpty(executable.name),
        type: isEmpty(executable.type),
        sourceFile: isEmpty(executable.sourceFile),
        dockerImage: false,
        buildScript: false,
      });
    } else if (executable.type === 'CHECKER') {
      setErrors({
        name: isEmpty(executable.name),
        type: isEmpty(executable.type),
        sourceFile: isEmpty(executable.sourceFile),
        dockerImage: isEmpty(executable.dockerImage),
        buildScript: isEmpty(executable.buildScript),
      });
    }
  }, [executable, executable.type]);

  return (
    <FormModal
      title={`${executable.id ? 'Update' : 'Create'} Executable`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSubmit(executable)}
      submitDisabled={Object.values(errors).some((e) => e)}
    >
      <div
        className={classNames('grid gap-2', {
          'sm:grid-cols-2': executable.type !== 'CHECKER',
          'sm:grid-cols-3': executable.type === 'CHECKER',
        })}
      >
        <TextInput<Executable>
          entity={executable}
          field="name"
          label="Name"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <TextInput<Executable> entity={executable} field="description" label="Description" />
        {executable.type === 'CHECKER' && (
          <TextInput<Executable>
            entity={executable}
            field="dockerImage"
            label="Docker Image"
            description="Docker image to run the checker script"
            required
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        <DropDownInput<Executable, ExecutableType>
          entity={executable}
          field="type"
          label="Type"
          description="Whether this executable is a runner (to run submissions) or a checker (to check the submission output)"
          required
          options={['RUNNER', 'CHECKER']}
          errors={errors}
          setErrors={setErrors}
        />
        <FileInput<Executable>
          entity={executable}
          field="sourceFile"
          label="Source File"
          description="Source file of the executable"
          required
          errors={errors}
          setErrors={setErrors}
        />
        <FileInput<Executable>
          entity={executable}
          field="buildScript"
          label="Build Script"
          description="Build script to compile the source file of the executable"
          required={executable.type === 'CHECKER'}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
      <CheckBoxInput<Executable>
        entity={executable}
        field="default"
        label="Default"
        description="Whether this executable is default of his type (Runner/Checker)"
        defaultValue={false}
      />
    </FormModal>
  );
};

export default ExecutableForm;
