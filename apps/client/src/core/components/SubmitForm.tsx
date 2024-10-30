import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { FileKind, Submission } from '@prisma/client';

import { useActiveContest, useAuthContext } from '@core/contexts';
import { useCreateSubmission, useFindManyLanguage } from '@core/queries';
import { uploadFile } from '@core/utils';

type Props = {
  submission?: Partial<Submission>;
  onClose: () => void;
};

export const SubmitForm: FC<Props> = ({ submission, onClose }) => {
  const { profile } = useAuthContext();
  const { currentContest } = useActiveContest();

  const [sourceFile, setSourceFile] = useState<File>();

  const form = useForm<Submission>({ defaultValues: structuredClone(submission) });

  const { data: languages = [] } = useFindManyLanguage();
  const { mutateAsync } = useCreateSubmission();

  useEffect(() => {
    form.reset(structuredClone(submission));
  }, [form, submission]);

  const onSubmit: SubmitHandler<Submission> = async (submission) => {
    if (!profile?.team || !currentContest) return;

    if (sourceFile) {
      const source = await uploadFile(sourceFile, {
        name: `Submissions/${profile.team.name}/${sourceFile.name}`,
        type: sourceFile.type,
        size: sourceFile.size,
        md5Sum: '',
        kind: FileKind.FILE,
        parentDirectoryName: `Submissions/${profile.team.name}`,
      });

      submission.sourceFileName = source.name;
    }

    await mutateAsync({
      data: {
        ...submission,
        teamId: profile.team.id,
        contestId: currentContest.id,
        submitTime: new Date(),
      },
    });

    onClose();
  };

  return (
    <FormDialog
      className="!max-w-xl"
      open={!!submission}
      form={form}
      title="Submit"
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <FormInputs.Select
        name="problemId"
        label="Problem"
        placeholder="Select a problem"
        items={(currentContest?.problems ?? []).map((p) => ({
          id: p.id,
          label: `${p.shortName} - ${p.problem.name}`,
          value: p.id,
        }))}
        required
      />
      <FormInputs.Select
        name="languageId"
        label="Language"
        placeholder="Select a language"
        items={languages.map((languages) => ({
          id: languages.id,
          label: `${languages.name} (${languages.extensions.join(', ')})`,
          value: languages.id,
        }))}
        required
      />
      <FormInputs.File
        name="sourceFileName"
        label="Source file"
        placeholder="Select the source file"
        accept={languages
          .find((language) => form.watch('languageId') === language.id)
          ?.extensions.map((ext) => `.${ext}`)
          .join(',')}
        onFileChange={setSourceFile}
        disabled={!form.watch('languageId')}
        required
      />
    </FormDialog>
  );
};
