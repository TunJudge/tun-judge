import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import {
  DropdownField,
  FileField,
  FormErrors,
  NumberField,
  TextField,
} from '../../../shared/extended-form';

const ProblemForm: DataTableItemForm<Problem> = observer(
  ({ item: problem, isOpen, onClose, submit }) => {
    const [errors, setErrors] = useState<FormErrors<Problem>>({});
    const { runners, checkers, fetchAll } = rootStore.executablesStore;

    useEffect(() => {
      setErrors({
        name: isEmpty(problem.name),
        timeLimit: isEmpty(problem.timeLimit),
        file: isEmpty(problem.file),
        runScript: isEmpty(problem.runScript),
        checkScript: isEmpty(problem.checkScript),
      });
    }, [problem]);

    useEffect(() => {
      fetchAll();
    }, [fetchAll]);

    useEffect(() => {
      if (!problem.runScript) {
        const defaultRunner = runners.find((e) => e.default);
        if (defaultRunner) problem.runScript = defaultRunner;
        setErrors((errors) => ({ ...errors, runScript: false }));
      }

      if (!problem.checkScript) {
        const defaultChecker = checkers.find((e) => e.default);
        if (defaultChecker) {
          problem.checkScript = defaultChecker;
          setErrors((errors) => ({ ...errors, checkScript: false }));
        }
      }
    }, [problem, runners, checkers]);

    return (
      <FormModal
        title={`${problem.id ? 'Update' : 'Create'} Problem`}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => submit(problem)}
        submitDisabled={Object.values(errors).some((e) => e)}
      >
        <form className="grid gap-y-2">
          <div className="grid sm:grid-cols-2 gap-2">
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
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
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
              placeHolder="Memory Limit"
              defaultValue={2097152}
              unit="Kb"
              errors={errors}
              setErrors={setErrors}
            />
            <NumberField<Problem>
              entity={problem}
              field="outputLimit"
              label="Output Limit (Kb)"
              placeHolder="Output Limit"
              defaultValue={8192}
              unit="Kb"
              errors={errors}
              setErrors={setErrors}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <DropdownField<Problem>
              entity={problem}
              field="runScript"
              label="Run Script"
              required
              options={runners}
              optionsTextField="name"
              errors={errors}
              setErrors={setErrors}
            />
            <DropdownField<Problem>
              entity={problem}
              field="checkScript"
              label="Check Script"
              required
              options={checkers}
              optionsTextField="name"
              errors={errors}
              setErrors={setErrors}
            />
          </div>
        </form>
      </FormModal>
    );
  },
);

export default ProblemForm;
