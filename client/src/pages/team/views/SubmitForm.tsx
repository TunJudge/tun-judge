import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Submission } from '../../../core/models';
import { FileField, FormErrors } from '../../shared/extended-form';
import { isEmpty } from '../../../core/helpers';
import { rootStore } from '../../../core/stores/RootStore';

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
    languagesStore: { data: languages, fetchAll },
    publicStore: { currentContest },
    teamStore: { sendSubmission },
    profile,
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
          />
          <Form.Dropdown
            selection
            label="Problem"
            placeholder="Problem"
            defaultValue={submission.problem?.id}
            options={
              currentContest?.problems
                .map(({ shortName, problem }) => ({
                  key: problem.id,
                  text: `${shortName} - ${problem.name}`,
                  value: problem.id,
                }))
                .sort((a, b) => a.text.localeCompare(b.text)) ?? []
            }
            onChange={(_, { value }) => {
              submission.problem = currentContest!.problems.find(
                (c) => c.problem.id === value,
              )!.problem;
              setErrors({ ...errors, problem: false });
            }}
            error={errors.problem}
          />
          <Form.Dropdown
            selection
            label="Language"
            placeholder="Language"
            defaultValue={submission.language?.id}
            options={
              languages?.map((languages) => ({
                key: languages.id,
                text: `${languages.name} (${languages.extensions.join(', ')})`,
                value: languages.id,
              })) ?? []
            }
            onChange={(_, { value }) => {
              submission.language = languages.find((l) => l.id === value)!;
              setErrors({ ...errors, language: false });
            }}
            error={errors.language}
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
