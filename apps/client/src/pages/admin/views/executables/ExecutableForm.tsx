import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDialog, FormInputs } from 'tw-react-components';

import { Executable, ExecutableType, FileKind } from '@prisma/client';

import { useToastContext } from '@core/contexts';
import { uploadFile } from '@core/utils';
import { useUpsertExecutable } from '@models';

import { executableTypeText } from './ExecutablesList';

type Props = {
  executable?: Partial<Executable>;
  onSubmit?: (id: number) => void;
  onClose: () => void;
};

export const ExecutableForm: FC<Props> = ({ executable, onClose, onSubmit }) => {
  const { toast } = useToastContext();

  const [sourceFile, setSourceFile] = useState<File>();
  const [buildScriptFile, setBuildScriptFile] = useState<File>();

  const form = useForm<Executable>({ defaultValues: structuredClone(executable) });

  const { mutateAsync } = useUpsertExecutable();

  useEffect(() => {
    form.reset(structuredClone(executable));
  }, [form, executable]);

  const handleSubmit = async ({ id = -1, ...executable }: Executable) => {
    try {
      if (sourceFile) {
        const source = await uploadFile(sourceFile, {
          name: `Executables/${executable.name}/${sourceFile.name}`,
          type: sourceFile.type,
          size: sourceFile.size,
          md5Sum: '',
          kind: FileKind.FILE,
          parentDirectoryName: `Executables/${executable.name}`,
        });

        executable.sourceFileName = source.name;
      }

      if (buildScriptFile) {
        const buildScript = await uploadFile(buildScriptFile, {
          name: `Executables/${executable.name}/${buildScriptFile.name}`,
          type: buildScriptFile.type,
          size: buildScriptFile.size,
          md5Sum: '',
          kind: FileKind.FILE,
          parentDirectoryName: `Executables/${executable.name}`,
        });

        executable.buildScriptName = buildScript.name;
      }

      const newExecutable = await mutateAsync({
        where: { id },
        create: executable,
        update: executable,
      });

      if (!newExecutable) return;

      toast('success', `Executable ${newExecutable?.id ? 'updated' : 'created'} successfully`);

      onSubmit?.(newExecutable?.id);
      onClose();
    } catch (error: unknown) {
      toast(
        'error',
        `Failed to ${id ? 'update' : 'create'} executable with error: ${(error as Error).message}`,
      );
    }
  };

  return (
    <FormDialog
      className="!max-w-xl"
      open={!!executable}
      form={form}
      title={`${executable?.id ? 'Update' : 'Create'} Executable`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FormInputs.Text name="name" label="Name" placeholder="Name" autoComplete="off" required />
      <FormInputs.Text name="description" label="Description" placeholder="Description" />
      {form.getValues('type') === ExecutableType.CHECKER && (
        <FormInputs.Text
          name="dockerImage"
          label="Docker Image"
          placeholder="Docker Image"
          description="Docker image to run the checker script"
          required
        />
      )}
      <FormInputs.Select
        name="type"
        label="Type"
        placeholder="Select Type"
        description="Whether this executable is a runner (to run submissions) or a checker (to check the submission output)"
        required
        items={[
          {
            id: ExecutableType.RUNNER,
            label: executableTypeText.RUNNER,
            value: ExecutableType.RUNNER,
          },
          {
            id: ExecutableType.CHECKER,
            label: executableTypeText.CHECKER,
            value: ExecutableType.CHECKER,
          },
        ]}
      />
      <FormInputs.File
        name="sourceFile"
        label="Source File"
        placeholder="Source File"
        description="Source file of the executable"
        onFileChange={setSourceFile}
        required
      />
      <FormInputs.File
        name="buildScript"
        label="Build Script"
        placeholder="Build Script"
        description="Build script to compile the source file of the executable"
        onFileChange={setBuildScriptFile}
        required={form.getValues('type') === ExecutableType.CHECKER}
      />
      <FormInputs.Checkbox
        name="default"
        label="Default"
        description="Whether this executable is default of his type (Runner/Checker)"
      />
    </FormDialog>
  );
};
