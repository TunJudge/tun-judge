import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Form, Icon, Label, SemanticWIDTHS } from 'semantic-ui-react';
import { isEmpty } from '../../core/helpers';
import { DateTimeInput } from 'semantic-ui-calendar-react';

export type FormErrors<T> = Partial<Record<keyof T, boolean>>;
export const MOMENT_DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

type ExtendedFieldProps<T> = {
  entity: Partial<T>;
  field: keyof T;
  label: string;
  placeHolder?: string;
  defaultValue?: any;
  width?: SemanticWIDTHS;
  required?: boolean;
  errors: FormErrors<T>;
  setErrors: (errors: FormErrors<T>) => void;
};

type DateTimeFieldProps<T> = ExtendedFieldProps<T> & {
  minDate?: Date;
  maxDate?: Date;
};

export function DateTimeField<T>({
  entity,
  field,
  label,
  placeHolder,
  required,
  minDate,
  maxDate,
  errors,
  setErrors,
}: DateTimeFieldProps<T>): any {
  return (
    <DateTimeInput
      closable
      required={required}
      name={field}
      label={label}
      placeholder={placeHolder ?? label}
      dateFormat={MOMENT_DEFAULT_FORMAT}
      value={entity[field] ? moment(entity[field]).format(MOMENT_DEFAULT_FORMAT) : ''}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(_, { value }) => {
        entity[field] = moment(value, MOMENT_DEFAULT_FORMAT).toDate() as any;
        setErrors({ ...errors, [field]: false });
      }}
      error={errors[field]}
    />
  );
}

export function TextField<T>({
  entity,
  field,
  label,
  placeHolder,
  width,
  required,
  errors,
  setErrors,
}: ExtendedFieldProps<T>): any {
  return (
    <Form.Input
      width={width}
      required={required}
      label={label}
      placeholder={placeHolder ?? label}
      defaultValue={entity[field]}
      onChange={(_, { value }) => {
        entity[field] = value as any;
        if (isEmpty(value.trim())) {
          setErrors({ ...errors, [field]: true });
        } else {
          setErrors({ ...errors, [field]: false });
        }
      }}
      error={errors[field]}
    />
  );
}

type NumberFieldProps<T> = ExtendedFieldProps<T> & { unit?: string };

export function NumberField<T>({
  entity,
  field,
  label,
  placeHolder,
  width,
  required,
  unit,
  errors,
  setErrors,
}: NumberFieldProps<T>): any {
  return (
    <Form.Input
      type="number"
      width={width}
      required={required}
      label={label}
      labelPosition={unit ? 'right' : undefined}
      placeholder={placeHolder ?? label}
      defaultValue={entity[field]}
      onChange={(_, { value }) => {
        entity[field] = value as any;
        if (isEmpty(value.trim())) {
          setErrors({ ...errors, [field]: true });
        } else {
          setErrors({ ...errors, [field]: false });
        }
      }}
      error={errors[field]}
    >
      <input />
      {unit && <Label basic>{unit}</Label>}
    </Form.Input>
  );
}

export function CheckBoxField<T>({
  entity,
  field,
  label,
  width,
  required,
  defaultValue,
  errors,
  setErrors,
}: ExtendedFieldProps<T>): any {
  return (
    <Form.Checkbox
      width={width}
      required={required}
      label={label}
      defaultChecked={entity[field] ?? defaultValue}
      onChange={(_, { checked }) => {
        entity[field] = checked as any;
        setErrors({ ...errors, [field]: false });
      }}
      error={errors[field]}
    />
  );
}

type FileFieldProps<T> = ExtendedFieldProps<T> & { typeField: keyof T };

export function FileField<T>({
  entity,
  field,
  typeField,
  label,
  placeHolder,
  width,
  required,
  errors,
  setErrors,
}: FileFieldProps<T>): any {
  const [fileName, setFileName] = useState<string>((entity[typeField] as any) ?? '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Form.Input
        width={width}
        required={required}
        label={label}
        readOnly
        value={fileName}
        placeholder={placeHolder ?? label}
        onClick={() => fileInputRef.current?.click()}
        icon={<Icon name="upload" />}
        error={errors[field]}
      />
      <input
        ref={(ref) => (fileInputRef.current = ref)}
        type="file"
        hidden
        accept="application/pdf, text/html"
        onChange={({ target: { files } }) => {
          if (files && files.length > 0) {
            setFileName(files[0].name);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(files[0]);
            fileReader.onloadend = (event) => {
              if (event.target?.readyState === FileReader.DONE) {
                entity[field] = event.target?.result as any;
                entity[typeField] = files[0].type as any;
                setErrors({ ...errors, [field]: false });
              }
            };
          }
        }}
      />
    </>
  );
}
