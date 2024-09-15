import { UploadIcon } from '@heroicons/react/outline';
import { MD5 } from 'crypto-js';
import React, { useRef, useState } from 'react';

import BasicInput, { BasicInputProps } from './BasicInput';
import { EntityFieldInputProps } from './types';

type Props<T> = EntityFieldInputProps<T, File> & {
  accept?: string;
  multiple?: boolean;
} & BasicInputProps;

function FileInput<T>({
  entity,
  field,
  errors,
  setErrors,
  onChange,
  accept,
  multiple,
  ...props
}: Props<T>): JSX.Element {
  const [_fileName, setFileName] = useState<string>((entity[field] as any)?.name ?? '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = (event) => {
        if (event.target?.readyState === FileReader.DONE) {
          const payload = (event.target.result as string).split(';base64,').pop();
          entity[field] = {
            ...(entity[field] as any),
            name: file.name,
            type: file.type,
            size: file.size,
            md5Sum: MD5(payload as string).toString(),
            content: {
              ...(entity[field] as any)?.content,
              payload: payload,
            },
          } as File as any;
          setErrors?.({ ...errors, [field]: false });
          onChange?.(entity[field] as any);
        }
      };
    }
  };
  return (
    <>
      <BasicInput
        {...props}
        type="text"
        readOnly
        value={_fileName}
        hasErrors={errors?.[field]}
        icon={UploadIcon}
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        ref={(ref) => (fileInputRef.current = ref)}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={onFileChange}
      />
    </>
  );
}

export default FileInput;
