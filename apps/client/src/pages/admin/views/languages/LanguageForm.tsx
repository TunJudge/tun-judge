import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, FormDialog, FormInputs } from 'tw-react-components';

import { useToastContext } from '@core/contexts';
import { useUpsertLanguage } from '@models';

import { Language } from './LanguagesList';

type Props = {
  language?: Partial<Language>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const LanguageForm: FC<Props> = ({ language, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const form = useForm<Language>({ defaultValues: structuredClone(language) });

  const { mutateAsync } = useUpsertLanguage();

  useEffect(() => {
    form.reset(structuredClone(language));
  }, [form, language]);

  const handleSubmit = async ({ id = -1, buildScript, ...language }: Language) => {
    try {
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
      className="!max-w-7xl"
      open={!!language}
      form={form}
      title={`${language?.id ? 'Update' : 'Create'} Language`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Flex direction="column" fullWidth>
        <Flex fullWidth>
          <FormInputs.Text name="name" label="Name" placeholder="Name" required />
          <FormInputs.Text
            name="dockerImage"
            label="Docker Image"
            placeholder="Docker Image"
            description="Docker image to process any submission sent with this language"
            required
          />
          {/* <FileInput
            entity={language}
            field="buildScript"
            label="Build Script"
            description="The script responsible for build a code source of this language"
            required
            errors={errors}
            setErrors={setErrors}
          /> */}
        </Flex>
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
          search
          multiple
          required
          allowAddition
        />
        <Flex fullWidth>
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
        </Flex>
      </Flex>
    </FormDialog>
  );
};
