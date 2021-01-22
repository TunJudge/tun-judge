import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { isEmpty } from '../../../core/helpers';
import { Submission } from '../../../core/models';
import { rootStore } from '../../../core/stores/RootStore';
import { DropdownField, FileField, FormErrors } from '../../shared/extended-form';

type SubmissionFormProps = {
  item: Submission;
  dismiss: () => void;
};

const SubmitForm: React.FC<SubmissionFormProps> = observer(({ item: submission, dismiss }) => {
  const [errors, setErrors] = useState<FormErrors<Submission>>({
    file: isEmpty(submission.file),
    problem: isEmpty(submission.problem),
    language: isEmpty(submission.language),
  });
  const {
    languagesStore: { data: languages },
    publicStore: { currentContest },
    teamStore: { sendSubmission },
    profile,
  } = rootStore;

  return (
    <Modal open onClose={dismiss} size="tiny">
      <Modal.Header>Submit</Modal.Header>
      <Modal.Content>
        <Form>
          <FileField<Submission>
            entity={submission}
            field="file"
            label="Source file"
            errors={errors}
            setErrors={setErrors}
            onChange={() => {
              if (!submission.file) return;
              const language = languages.find((l) =>
                l.extensions.some((e) => submission.file.name.endsWith(e)),
              );
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
            field="problem"
            label="Problem"
            fluid
            required
            selection
            options={(currentContest?.problems ?? [])
              .map((p) => ({ ...p.problem, name: `${p.shortName} - ${p.problem.name}` }))
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))}
            optionsTextField="name"
            isObject
            errors={errors}
            setErrors={setErrors}
          />
          <DropdownField<Submission>
            entity={submission}
            field="language"
            label="Language"
            fluid
            required
            selection
            options={languages.map((languages) => ({
              ...languages,
              name: `${languages.name} (${languages.extensions.join(', ')})`,
            }))}
            optionsTextField="name"
            isObject
            errors={errors}
            setErrors={setErrors}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={dismiss}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={async () => {
            await sendSubmission(currentContest!.id, profile!.team.id, submission);
            dismiss();
          }}
          disabled={Object.values(errors).some((e) => e)}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
});

export default SubmitForm;
