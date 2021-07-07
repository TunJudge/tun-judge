import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../core/helpers';
import { Submission } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { DataTableItemForm } from '../../shared/data-table/DataTable';
import { FormModal } from '../../shared/dialogs';
import { DropdownField, FileField, FormErrors } from '../../shared/extended-form';

const SubmitForm: DataTableItemForm<Submission> = observer(
  ({ item: submission, isOpen, onClose, onSubmit }) => {
    const [errors, setErrors] = useState<FormErrors<Submission>>({});
    const {
      languagesStore: { allowedToSubmit: languages },
      publicStore: { currentContest },
    } = rootStore;

    useEffect(() => {
      setErrors({
        file: isEmpty(submission?.file),
        problem: isEmpty(submission?.problem),
        language: isEmpty(submission?.language),
      });
    }, [submission]);

    return (
      <FormModal
        size="lg"
        title="Submit"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={() => onSubmit(submission)}
        submitDisabled={Object.values(errors).some((e) => e)}
      >
        <DropdownField<Submission>
          entity={submission}
          field="problem"
          label="Problem"
          required
          options={(currentContest?.problems ?? [])
            .map((p) => ({ ...p.problem, name: `${p.shortName} - ${p.problem.name}` }))
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))}
          optionsTextField="name"
          errors={errors}
          setErrors={setErrors}
        />
        <FileField<Submission>
          entity={submission}
          field="file"
          label="Source file"
          required
          errors={errors}
          setErrors={setErrors}
          onChange={(file) => {
            if (!file) return;
            const language = languages.find((l) => l.extensions.some((e) => file.name.endsWith(e)));
            if (language) {
              submission.language = { ...language };
              setErrors((errors) => ({ ...errors, language: false }));
            } else {
              setErrors((errors) => ({ ...errors, file: true }));
            }
          }}
        />
        <DropdownField<Submission>
          entity={submission}
          field="language"
          label="Language"
          required
          options={languages.map((languages) => ({
            ...languages,
            name: `${languages.name} (${languages.extensions.join(', ')})`,
          }))}
          optionsTextField="name"
          errors={errors}
          setErrors={setErrors}
        />
      </FormModal>
    );
  },
);

export default SubmitForm;
