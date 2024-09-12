import React from 'react';

import { isEmpty } from '@core/helpers';

import BasicInput, { BasicInputProps } from './BasicInput';
import { EntityFieldInputProps } from './types';

type Props<T> = EntityFieldInputProps<T, boolean> & BasicInputProps;

function CheckBoxInput<T>({
  entity,
  field,
  errors,
  setErrors,
  onChange,
  ...props
}: Props<T>): JSX.Element {
  if (isEmpty(entity[field]) && !isEmpty(props.defaultValue)) {
    entity[field] = props.defaultValue;
  }

  const onInputChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    entity[field] = checked as any;
    setErrors?.({ ...errors, [field]: false });
    onChange?.(checked);
  };

  return (
    <BasicInput
      {...props}
      type="checkbox"
      defaultValue={entity[field] ?? props.defaultValue}
      hasErrors={errors?.[field]}
      onChange={onInputChange}
    />
  );
}

export default CheckBoxInput;
