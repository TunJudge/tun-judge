export type FormErrors<T> = Partial<Record<keyof T, boolean>>;

export type ColSpanWidth =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | 'none';

export type EntityFieldInputProps<T, R = any> = {
  entity: Partial<T>;
  field: keyof T;
  errors?: FormErrors<T>;
  setErrors?: (errors: FormErrors<T>) => void;
  onChange?: (value: R) => void;
};
