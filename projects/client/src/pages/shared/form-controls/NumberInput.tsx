import classNames from 'classnames';
import React from 'react';
import { isEmpty } from '../../../core/helpers';
import BasicInput, { BasicInputProps } from './BasicInput';
import { EntityFieldInputProps } from './types';

export type NumberInputProps = BasicInputProps & {
  min?: number;
  max?: number;
  step?: number;
};

type Props<T> = EntityFieldInputProps<T, number> & { unit?: string } & NumberInputProps;

function NumberInput<T>({
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

  const onInputChange = ({ target: { value, validity } }: React.ChangeEvent<HTMLInputElement>) => {
    entity[field] = Number(value) as any;
    if (isEmpty(value.trim()) || !validity.valid) {
      props.required && setErrors?.({ ...errors, [field]: true });
    } else {
      setErrors?.({ ...errors, [field]: false });
    }
    onChange?.(Number(value));
  };

  return (
    <BasicInput
      {...props}
      type="number"
      defaultValue={entity[field] ?? props.defaultValue}
      hasErrors={errors?.[field]}
      icon={
        props.unit
          ? ({ className }) => <div className={classNames(className, 'w-min')}>{props.unit}</div>
          : undefined
      }
      onChange={onInputChange}
    />
  );
}

export default NumberInput;
