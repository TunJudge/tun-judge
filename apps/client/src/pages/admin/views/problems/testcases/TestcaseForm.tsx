import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { isEmpty } from '@core/helpers';
import { File, Testcase } from '@core/models';
import { DataTableItemForm } from '@shared/data-table/DataTable';
import { FormModal } from '@shared/dialogs';
import FileInput from '@shared/form-controls/FileInput';
import TextInput from '@shared/form-controls/TextInput';
import { FormErrors } from '@shared/form-controls/types';

const TestcaseForm: DataTableItemForm<Testcase> = observer(
  ({ item: testcase, isOpen, onClose, onSubmit }) => {
    const [errors, setErrors] = useState<FormErrors<Testcase>>({});

    useEffect(() => {
      setErrors({
        input: isEmpty(testcase.id) && isEmpty(testcase.input),
        output: isEmpty(testcase.id) && isEmpty(testcase.output),
      });
    }, [testcase]);

    return (
      <FormModal
        title={`${testcase.id ? 'Update' : 'Create'} Testcase`}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => onSubmit(testcase)}
        submitDisabled={Object.values(errors).some((e) => e)}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          <FileInput<Testcase>
            entity={testcase}
            field="input"
            label="Input File"
            placeHolder="*.in"
            accept=".in"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextInput<File>
            entity={testcase.input ?? {}}
            field="md5Sum"
            label="Input File MD5"
            readOnly
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <FileInput<Testcase>
            entity={testcase}
            field="output"
            label="Output File"
            placeHolder="*.ans"
            accept=".ans"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <TextInput<File>
            entity={testcase.output ?? {}}
            field="md5Sum"
            label="Output File MD5"
            readOnly
          />
        </div>
        <TextInput<Testcase> entity={testcase} field="description" label="Description" />
      </FormModal>
    );
  },
);

export default TestcaseForm;
