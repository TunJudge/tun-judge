import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../../core/helpers';
import { Executable, Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import { DataTableItemForm } from '../../../shared/data-table/DataTable';
import { FormModal } from '../../../shared/dialogs';
import DropDownInput from '../../../shared/form-controls/DropDownInput';
import FileInput from '../../../shared/form-controls/FileInput';
import NumberInput from '../../../shared/form-controls/NumberInput';
import TextInput from '../../../shared/form-controls/TextInput';
import { FormErrors } from '../../../shared/form-controls/types';

const ProblemForm: DataTableItemForm<Problem> = observer(
  ({ item: problem, isOpen, onClose, onSubmit }) => {
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
        onSubmit={() => onSubmit(problem)}
        submitDisabled={Object.values(errors).some((e) => e)}
      >
        <div className="grid sm:grid-cols-2 gap-2">
          <TextInput<Problem>
            entity={problem}
            field="name"
            label="Name"
            required
            errors={errors}
            setErrors={setErrors}
          />
          <FileInput<Problem>
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
          <NumberInput<Problem>
            entity={problem}
            field="timeLimit"
            label="Time Limit (Seconds)"
            required
            unit="S"
            min={0}
            step={0.1}
            errors={errors}
            setErrors={setErrors}
          />
          <NumberInput<Problem>
            entity={problem}
            field="memoryLimit"
            label="Memory Limit (Kb)"
            placeHolder="Memory Limit"
            defaultValue={2097152}
            unit="Kb"
            min={0}
            errors={errors}
            setErrors={setErrors}
          />
          <NumberInput<Problem>
            entity={problem}
            field="outputLimit"
            label="Output Limit (Kb)"
            placeHolder="Output Limit"
            defaultValue={8192}
            unit="Kb"
            min={0}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <DropDownInput<Problem, Executable>
            entity={problem}
            field="runScript"
            label="Run Script"
            description="Submissions runner"
            required
            options={runners}
            optionsTextField="name"
            errors={errors}
            setErrors={setErrors}
          />
          <DropDownInput<Problem, Executable>
            entity={problem}
            field="checkScript"
            label="Check Script"
            description="Submissions output checker"
            required
            options={checkers}
            optionsTextField="name"
            errors={errors}
            setErrors={setErrors}
          />
        </div>
      </FormModal>
    );
  },
);

export default ProblemForm;
