import React from 'react';

import { isEmpty } from '@core/helpers';

import BasicInput, { BasicInputProps } from './BasicInput';
import { EntityFieldInputProps } from './types';

export type TextInputProps = BasicInputProps & { pattern?: string };

type Props<T> = EntityFieldInputProps<T, string> & TextInputProps;

function TextInput<T>({
  entity,
  field,
  errors,
  setErrors,
  onChange,
  ...props
}: Props<T>): JSX.Element {
  const onInputChange = ({ target: { value, validity } }: React.ChangeEvent<HTMLInputElement>) => {
    entity[field] = value as any;
    if (isEmpty(value.trim()) || !validity.valid) {
      props.required && setErrors?.({ ...errors, [field]: true });
    } else {
      setErrors?.({ ...errors, [field]: false });
    }
    onChange?.(value);
  };

  return (
    <BasicInput
      {...props}
      defaultValue={entity[field] ?? props.defaultValue}
      hasErrors={errors?.[field]}
      onChange={onInputChange}
    />
  );
}

export default TextInput;
