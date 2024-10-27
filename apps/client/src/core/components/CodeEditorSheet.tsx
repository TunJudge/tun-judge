import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormDialog } from 'tw-react-components';

import { FileKind } from '@prisma/client';

import { downloadFile, uploadFile } from '@core/utils';

import CodeEditor, { CodeEditorLanguages } from './CodeEditor';

export const CodeEditorSheet: FC<{
  fileName?: string;
  readOnly: boolean;
  lang?: CodeEditorLanguages;
  onClose: () => void;
}> = ({ fileName, readOnly, lang = 'sh', onClose }) => {
  const form = useForm({ defaultValues: { content: '' } });

  useEffect(() => {
    if (!fileName) return;

    (async () => {
      const content = await downloadFile(fileName);

      form.reset({ content });
    })();
  }, [form, fileName]);

  const onSubmit: SubmitHandler<{ content: string }> = async ({ content }) => {
    if (!fileName) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], fileName, { type: 'text/plain' });

    await uploadFile(
      file,
      {
        name: file.name,
        type: file.type,
        size: file.size,
        md5Sum: '',
        kind: FileKind.FILE,
        parentDirectoryName: fileName.replace(/\/[^/]+$/, ''),
      },
      true,
    );

    onClose();
  };

  return (
    <FormDialog
      className="!max-w-7xl"
      title={`Edit '${fileName?.replace(/^([^/]*\/)+/g, '')}' script file`}
      open={!!fileName}
      form={form}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <CodeEditor
        lang={lang}
        value={form.watch('content')}
        readOnly={readOnly}
        onChange={(value) => form.setValue('content', value)}
      />
    </FormDialog>
  );
};
