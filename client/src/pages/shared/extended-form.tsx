import { MD5 } from 'crypto-js';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { Form, Icon, Label, SemanticWIDTHS } from 'semantic-ui-react';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';
import { isEmpty } from '../../core/helpers';
import { File } from '../../core/models';

export type FormErrors<T> = Partial<Record<keyof T, boolean>>;
export const MOMENT_DEFAULT_FORMAT = 'DD-MM-YYYY HH:mm:ss';

type ExtendedFieldProps<T> = {
  entity: Partial<T>;
  field: keyof T;
  type?: string;
  label?: string;
  autoComplete?: string;
  placeHolder?: string;
  defaultValue?: any;
  width?: SemanticWIDTHS;
  required?: boolean;
  readOnly?: boolean;
  errors?: FormErrors<T>;
  setErrors?: (errors: FormErrors<T>) => void;
  onChange?: () => void;
};

type DateTimeFieldProps<T> = ExtendedFieldProps<T> & {
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
};

export function DateTimeField<T>({
  entity,
  field,
  label,
  placeHolder,
  required,
  clearable,
  minDate,
  maxDate,
  disabled,
  errors,
  setErrors,
  onChange,
}: DateTimeFieldProps<T>): any {
  return (
    <DateTimeInput
      closable
      required={required}
      clearable={clearable}
      name={field}
      label={label}
      placeholder={placeHolder ?? label}
      dateFormat={MOMENT_DEFAULT_FORMAT}
      value={entity[field] ? moment(entity[field]).format(MOMENT_DEFAULT_FORMAT) : ''}
      minDate={minDate && new Date(minDate)}
      maxDate={maxDate && new Date(maxDate)}
      disabled={disabled}
      onChange={(_, { value }) => {
        entity[field] = isEmpty(value)
          ? null
          : (moment(value, MOMENT_DEFAULT_FORMAT).toDate() as any);
        setErrors?.({ ...errors, [field]: false });
        onChange?.();
      }}
      error={errors?.[field]}
    />
  );
}

type TextFieldProps<T> = ExtendedFieldProps<T> & { pattern?: string };

export function TextField<T>({
  entity,
  field,
  type,
  label,
  autoComplete,
  placeHolder,
  defaultValue,
  width,
  required,
  readOnly,
  pattern,
  errors,
  setErrors,
  onChange,
}: TextFieldProps<T>): any {
  return (
    <Form.Input
      width={width ?? '16'}
      required={required}
      readOnly={readOnly}
      pattern={pattern}
      type={type}
      autoComplete={autoComplete}
      label={label}
      placeholder={placeHolder ?? label}
      defaultValue={entity[field] ?? defaultValue}
      onChange={({ target: { validity } }, { value }) => {
        entity[field] = value as any;
        if ((required && isEmpty(value.trim())) || !validity.valid) {
          setErrors?.({ ...errors, [field]: true });
        } else {
          setErrors?.({ ...errors, [field]: false });
        }
        onChange?.();
      }}
      error={errors?.[field]}
    />
  );
}

export function TextAreaField<T>({
  entity,
  field,
  type,
  label,
  autoComplete,
  placeHolder,
  defaultValue,
  width,
  required,
  readOnly,
  errors,
  setErrors,
  onChange,
}: ExtendedFieldProps<T>): any {
  return (
    <Form.TextArea
      width={width ?? '16'}
      required={required}
      readOnly={readOnly}
      type={type}
      autoComplete={autoComplete}
      label={label}
      placeholder={placeHolder ?? label}
      defaultValue={entity[field] ?? defaultValue}
      onChange={({ target: { validity } }, { value }) => {
        entity[field] = value as any;
        if ((required && isEmpty((value as string).trim())) || !validity.valid) {
          setErrors?.({ ...errors, [field]: true });
        } else {
          setErrors?.({ ...errors, [field]: false });
        }
        onChange?.();
      }}
      error={errors?.[field]}
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
  defaultValue,
  readOnly,
  unit,
  errors,
  setErrors,
  onChange,
}: NumberFieldProps<T>): any {
  if (isEmpty(entity[field]) && !isEmpty(defaultValue)) {
    entity[field] = defaultValue;
  }
  return (
    <Form.Input
      type="number"
      width={width ?? '16'}
      required={required}
      readOnly={readOnly}
      label={label}
      labelPosition={unit ? 'right' : undefined}
      placeholder={placeHolder ?? label}
      defaultValue={entity[field]}
      onChange={(_, { value }) => {
        entity[field] = value as any;
        if (isEmpty(value.trim())) {
          setErrors?.({ ...errors, [field]: true });
        } else {
          setErrors?.({ ...errors, [field]: false });
        }
        onChange?.();
      }}
      error={errors?.[field]}
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
  readOnly,
  defaultValue,
  errors,
  setErrors,
  onChange,
}: ExtendedFieldProps<T>): any {
  if (isEmpty(entity[field]) && !isEmpty(defaultValue)) {
    entity[field] = defaultValue;
  }
  return (
    <Form.Checkbox
      width={width ?? '16'}
      required={required}
      readOnly={readOnly}
      label={label}
      defaultChecked={entity[field] ?? defaultValue}
      onChange={(_, { checked }) => {
        entity[field] = checked as any;
        setErrors?.({ ...errors, [field]: false });
        onChange?.();
      }}
      error={errors?.[field]}
    />
  );
}

type FileFieldProps<T> = ExtendedFieldProps<T> & {
  accept?: string;
  multiple?: boolean;
};

export function FileField<T>({
  entity,
  field,
  label,
  placeHolder,
  width,
  required,
  errors,
  setErrors,
  onChange,
  accept,
  multiple,
}: FileFieldProps<T>): any {
  const [_fileName, setFileName] = useState<string>((entity[field] as any)?.name ?? '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Form.Input
        width={width ?? '16'}
        required={required}
        label={label}
        readOnly
        value={_fileName}
        placeholder={placeHolder ?? label}
        onClick={() => fileInputRef.current?.click()}
        icon={<Icon name="upload" />}
        error={errors?.[field]}
      />
      <input
        ref={(ref) => (fileInputRef.current = ref)}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={async ({ target: { files } }) => {
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
                onChange?.();
              }
            };
          }
        }}
      />
    </>
  );
}

type DropdownFieldProps<T> = ExtendedFieldProps<T> & {
  options?: any[];
  optionsIdField?: string;
  optionsTextField?: string;
  isObject?: boolean;
  search?: boolean;
  selection?: boolean;
  fluid?: boolean;
  multiple?: boolean;
  allowAdditions?: boolean;
};

export function DropdownField<T>({
  entity,
  field,
  label,
  placeHolder,
  width,
  required,
  options,
  optionsIdField,
  optionsTextField,
  isObject,
  search,
  selection,
  fluid,
  multiple,
  allowAdditions,
  errors,
  setErrors,
  onChange,
}: DropdownFieldProps<T>): any {
  const [optionsState, setOptions] = useState<DropdownItemProps[]>([]);

  useEffect(() => {
    setOptions(
      (options ?? (entity[field] as any) ?? []).map((value: any) => {
        if (typeof value === 'object') {
          return {
            key: value[optionsIdField ?? 'id'],
            text: value[optionsTextField ?? 'id'],
            value: value[optionsIdField ?? 'id'],
          };
        } else {
          return {
            key: value,
            text: value,
            value: value,
          };
        }
      }),
    );
  }, [entity, field, options, optionsIdField, optionsTextField]);

  return (
    <Form.Dropdown
      options={optionsState}
      width={width ?? '16'}
      required={required}
      label={label}
      search={search}
      selection={selection}
      fluid={fluid}
      multiple={multiple}
      allowAdditions={allowAdditions}
      placeholder={placeHolder ?? label}
      value={
        multiple
          ? ((entity[field] as any) ?? []).map((value: any) =>
              typeof value === 'object' ? value[optionsIdField ?? 'id'] : value,
            )
          : typeof entity?.[field] === 'object'
          ? (entity[field] as any)[optionsIdField ?? 'id']
          : entity[field]
      }
      onChange={(_, { value }) => {
        if (multiple) {
          entity[field] = (
            isObject
              ? [...(value as any)].map((v) =>
                  options?.find((o) => o[optionsIdField ?? 'id'] === v),
                )
              : [...(value as any)]
          ) as any;
        } else {
          entity[field] = (
            isObject ? options?.find((o) => o[optionsIdField ?? 'id'] === value) : value
          ) as any;
        }
        if (isEmpty(value)) {
          setErrors?.({ ...errors, [field]: true });
        } else {
          setErrors?.({ ...errors, [field]: false });
        }
        onChange?.();
      }}
      onAddItem={(_, { value }) =>
        setOptions([...optionsState, { key: value, text: value, value } as any])
      }
      error={errors?.[field]}
    />
  );
}
