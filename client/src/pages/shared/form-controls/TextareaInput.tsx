import React from 'react';
import { isEmpty } from '../../../core/helpers';
import BasicInput, { BasicInputProps } from './BasicInput';
import { EntityFieldInputProps } from './types';

type Props<T> = EntityFieldInputProps<T, string> & BasicInputProps;

function TextareaInput<T>({
  entity,
  field,
  errors,
  setErrors,
  onChange,
  ...props
}: Props<T>): JSX.Element {
  const onInputChange = ({
    target: { value, validity },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      textarea
      defaultValue={entity[field] ?? props.defaultValue}
      hasErrors={errors?.[field]}
      onChange={onInputChange}
    />
  );
}

export default TextareaInput;
