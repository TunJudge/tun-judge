import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { FileKind } from '@prisma/client';

import { useToastContext } from '@core/contexts';
import { useUpsertLanguage } from '@core/queries';
import { uploadFile } from '@core/utils';

import { Language } from './LanguagesList';

type Props = {
  language?: Partial<Language>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const LanguageForm: FC<Props> = ({ language, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const [buildScriptFile, setBuildScriptFile] = useState<File>();

  const form = useForm<Language>({ defaultValues: structuredClone(language) });

  const { mutateAsync } = useUpsertLanguage();

  useEffect(() => {
    form.reset(structuredClone(language));
  }, [form, language]);

  const handleSubmit = async ({ id = -1, buildScript: _, ...language }: Language) => {
    try {
      if (buildScriptFile) {
        const buildScript = await uploadFile(buildScriptFile, {
          name: `Languages/${language.name}/${buildScriptFile.name}`,
          type: buildScriptFile.type,
          size: buildScriptFile.size,
          md5Sum: '',
          kind: FileKind.FILE,
          parentDirectoryName: `Languages/${language.name}`,
        });

        language.buildScriptName = buildScript.name;
      }

      const newLanguage = await mutateAsync({
        where: { id },
        create: language,
        update: language,
      });

      if (!newLanguage) return;

      toast('success', `Language ${newLanguage?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newLanguage?.id);
      onClose();
    } catch (error: unknown) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} language with error: ${(error as Error).message}`,
      );
    }
  };

  return (
    <FormDialog
      className="!max-w-xl"
      open={!!language}
      form={form}
      title={`${language?.id ? 'Update' : 'Create'} Language`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FormInputs.Text name="name" label="Name" placeholder="Name" autoComplete="off" required />
      <FormInputs.Text
        name="dockerImage"
        label="Docker Image"
        placeholder="Docker Image"
        description="Docker image to process any submission sent with this language"
        required
      />
      <FormInputs.File
        name="buildScriptName"
        label="Build Script"
        placeholder="Build Script"
        description="The script responsible for build a code source of this language"
        onFileChange={setBuildScriptFile}
        required
      />
      <FormInputs.Select
        name="extensions"
        label="File Extensions"
        placeholder="File Extensions"
        description="Possible file extensions for this language"
        items={
          form.watch('extensions')?.map((extension) => ({
            id: extension,
            label: extension,
            value: extension,
          })) ?? []
        }
        allowAddition
        onNewItemAdded={(newExtension) =>
          form.setValue('extensions', [...(form.watch('extensions') ?? []), newExtension])
        }
        search
        multiple
        required
      />
      <FormInputs.Checkbox
        name="allowJudge"
        label="Allow Judge"
        description="Whether to allow judges hosts to pull any submission sent with this language"
      />
      <FormInputs.Checkbox
        name="allowSubmit"
        label="Allow Submit"
        description="Whether to allow teams submit with this language"
      />
    </FormDialog>
  );
};
