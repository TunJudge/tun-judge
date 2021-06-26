import { Listbox } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ExclamationCircleIcon,
  SelectorIcon,
  XIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { MD5 } from 'crypto-js';
import React, { useEffect, useRef, useState } from 'react';
import { isEmpty, useLongPress } from '../../core/helpers';
import './extended-form.scss';

export type FormErrors<T> = Partial<Record<keyof T, boolean>>;
export const MOMENT_DEFAULT_FORMAT = 'DD-MM-YYYY HH:mm:ss';

type ColSpanWidth =
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

type ExtendedFieldProps<T> = {
  entity: Partial<T>;
  field: keyof T;
  type?: string;
  label?: string;
  autoComplete?: string;
  placeHolder?: string;
  defaultValue?: any;
  width?: ColSpanWidth;
  required?: boolean;
  readOnly?: boolean;
  errors?: FormErrors<T>;
  setErrors?: (errors: FormErrors<T>) => void;
  onChange?: (value: any) => void;
};

type TextFieldProps<T> = ExtendedFieldProps<T> & { pattern?: string };

export function TextField<T>({
  entity,
  field,
  type,
  label,
  autoComplete,
  placeHolder,
  defaultValue,
  width = 'none',
  required,
  readOnly,
  pattern,
  errors,
  setErrors,
  onChange,
}: TextFieldProps<T>): JSX.Element {
  const input = (className: string) => (
    <input
      className={className}
      required={required}
      readOnly={readOnly}
      pattern={pattern}
      type={type ?? 'text'}
      autoComplete={autoComplete}
      placeholder={placeHolder ?? label}
      defaultValue={entity[field] ?? defaultValue}
      onChange={({ target: { value, validity } }) => {
        entity[field] = value as any;
        if (isEmpty(value.trim()) || !validity.valid) {
          required && setErrors?.({ ...errors, [field]: true });
        } else {
          required && setErrors?.({ ...errors, [field]: false });
        }
        onChange?.(value);
      }}
    />
  );

  return (
    <LabeledInput
      label={label}
      hasError={errors?.[field]}
      required={required}
      width={width}
      input={input}
    />
  );
}

export function TextAreaField<T>({
  entity,
  field,
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
}: ExtendedFieldProps<T>): JSX.Element {
  const input = (className: string) => (
    <textarea
      className={classNames('-mb-2', className)}
      required={required}
      readOnly={readOnly}
      placeholder={placeHolder ?? label}
      autoComplete={autoComplete}
      defaultValue={entity[field] ?? defaultValue}
      onChange={({ target: { value, validity } }) => {
        entity[field] = value as any;
        if (isEmpty((value as string).trim()) || !validity.valid) {
          required && setErrors?.({ ...errors, [field]: true });
        } else {
          required && setErrors?.({ ...errors, [field]: false });
        }
        onChange?.(value);
      }}
    />
  );

  return (
    <LabeledInput
      label={label}
      hasError={errors?.[field]}
      required={required}
      width={width}
      input={input}
    />
  );
}

type NumberFieldProps<T> = ExtendedFieldProps<T> & { min?: number; max?: number; unit?: string };

export function NumberField<T>({
  entity,
  field,
  label,
  placeHolder,
  width,
  required,
  defaultValue,
  readOnly,
  min,
  max,
  unit,
  errors,
  setErrors,
  onChange,
}: NumberFieldProps<T>): JSX.Element {
  if (isEmpty(entity[field]) && !isEmpty(defaultValue)) {
    entity[field] = defaultValue;
  }

  const input = (className: string) => (
    <input
      className={className}
      type="number"
      required={required}
      readOnly={readOnly}
      placeholder={placeHolder ?? label}
      defaultValue={String(entity[field])}
      min={min}
      max={max}
      onChange={({ target: { value } }) => {
        entity[field] = Number(value) as any;
        if (isEmpty(value.trim())) {
          required && setErrors?.({ ...errors, [field]: true });
        } else {
          required && setErrors?.({ ...errors, [field]: false });
        }
        onChange?.(Number(value));
      }}
    />
  );

  return (
    <LabeledInput
      label={label}
      hasError={errors?.[field]}
      required={required}
      width={width}
      input={input}
    >
      {!errors?.[field] && unit && (
        <div className="absolute inset-y-0 right-0 flex items-center mr-4 text-gray-400">
          {unit}
        </div>
      )}
    </LabeledInput>
  );
}

export function CheckBoxField<T>({
  entity,
  field,
  label,
  width = 'none',
  required,
  readOnly,
  defaultValue,
  errors,
  setErrors,
  onChange,
}: ExtendedFieldProps<T>): JSX.Element {
  if (isEmpty(entity[field]) && !isEmpty(defaultValue)) {
    entity[field] = defaultValue;
  }
  return (
    <div className={`col-span-${width} flex items-center h-8`}>
      <input
        className="h-5 w-5 text-blue-600 border-gray-300 rounded"
        type="checkbox"
        required={required}
        readOnly={readOnly}
        defaultChecked={entity[field] ?? defaultValue}
        onChange={({ target: { checked } }) => {
          entity[field] = checked as any;
          required && setErrors?.({ ...errors, [field]: false });
          onChange?.(checked);
        }}
      />
      {label && (
        <label
          className={classNames('flex font-medium text-gray-700 ml-2', {
            'text-red-900': errors?.[field],
          })}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
    </div>
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
}: FileFieldProps<T>): JSX.Element {
  const [_fileName, setFileName] = useState<string>((entity[field] as any)?.name ?? '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const input = (className: string) => (
    <input
      className={className}
      type="text"
      required={required}
      readOnly
      value={_fileName}
      placeholder={placeHolder ?? label}
      onClick={() => fileInputRef.current?.click()}
    />
  );

  return (
    <>
      <LabeledInput
        label={label}
        hasError={errors?.[field]}
        required={required}
        width={width}
        input={input}
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
                required && setErrors?.({ ...errors, [field]: false });
                onChange?.((event.target.result as string).split(';base64,').pop());
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
  search?: boolean;
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
  search,
  multiple,
  allowAdditions,
  errors,
  setErrors,
  onChange,
}: DropdownFieldProps<T>): JSX.Element {
  const [optionsState, setOptions] = useState<{ key: string; text: string; value: any }[]>([]);
  const [selectedValues, setSelectedValues] = useState<{ key: string; text: string; value: any }[]>(
    [],
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<
    { key: string; text: string; value: any }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOptions(
      (options ?? (entity[field] as any) ?? []).map((value: any) =>
        typeof value === 'object'
          ? {
              key: value[optionsIdField ?? 'id'],
              text: value[optionsTextField ?? 'id'],
              value: value,
            }
          : {
              key: value,
              text: value,
              value: value,
            },
      ),
    );
    refreshSelectedValues();
  }, [entity, field, options, multiple, optionsIdField, optionsTextField]);

  useEffect(() => {
    refreshFilteredOptions();
  }, [search, searchValue, multiple, optionsState, selectedValues]);

  const refreshFilteredOptions = () =>
    setFilteredOptions(
      optionsState.filter(
        ({ key, text }) => !search || (!isOptionSelected(key) && text.includes(searchValue.trim())),
      ),
    );

  const refreshSelectedValues = () =>
    setSelectedValues(
      multiple
        ? ((entity[field] as any) ?? []).map((value: any) =>
            typeof value === 'object'
              ? {
                  key: value[optionsIdField ?? 'id'],
                  text: value[optionsTextField ?? 'id'],
                  value: value,
                }
              : {
                  key: value,
                  text: value,
                  value: value,
                },
          )
        : typeof entity?.[field] === 'object'
        ? [
            {
              key: (entity[field] as any)[optionsIdField ?? 'id'],
              text: (entity[field] as any)[optionsTextField ?? 'id'],
              value: entity[field] as any,
            },
          ]
        : entity[field]
        ? [{ key: entity[field], text: entity[field], value: entity[field] }]
        : [],
    );

  const isOptionSelected = (key: string) =>
    multiple
      ? !!((entity[field] as any) ?? []).find(
          (value: any) =>
            (typeof value === 'object' ? value[optionsIdField ?? 'id'] : value) === key,
        )
      : typeof entity?.[field] === 'object'
      ? (entity[field] as any)[optionsIdField ?? 'id'] === key
      : (entity[field] as any) === key;

  const selectOption = (key: string, value?: any) => {
    if (isOptionSelected(key)) return;

    if (!value) {
      value = optionsState.find((option) => option.key === key)?.value;
    }

    if (multiple) {
      entity[field] = [...((entity[field] as any) ?? []), value] as any;
    } else {
      entity[field] = value;
    }

    refreshSelectedValues();
    refreshFilteredOptions();
    inputRef.current && (inputRef.current.value = '');
    setSearchValue('');

    if (isEmpty(entity[field])) {
      required && setErrors?.({ ...errors, [field]: true });
    } else {
      required && setErrors?.({ ...errors, [field]: false });
    }
    onChange?.(value);
  };

  const unselectValue = (key: string) => (event?: React.MouseEvent<HTMLOrSVGElement>) => {
    event?.stopPropagation();

    entity[field] = ((entity[field] as any) ?? []).filter(
      (value: any) => (typeof value === 'object' ? value[optionsIdField ?? 'id'] : value) !== key,
    );

    refreshSelectedValues();
    refreshFilteredOptions();
    inputRef.current && (inputRef.current.value = '');
    setSearchValue('');

    if (isEmpty(entity[field])) {
      required && setErrors?.({ ...errors, [field]: true });
    } else {
      required && setErrors?.({ ...errors, [field]: false });
    }
  };

  const addOptionAndSelect = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.currentTarget.value;
    if (event.key === 'Enter' && value) {
      if (!filteredOptions.length && allowAdditions) {
        setOptions([...optionsState, { key: value, value: value, text: value }]);
        selectOption(value, value);
      } else if (filteredOptions.length) {
        selectOption(filteredOptions[0].key);
      }
    } else if (event.key === 'Backspace' && !value && selectedValues.length) {
      unselectValue(selectedValues[selectedValues.length - 1].key)();
    }
  };

  const onInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (triggerRef.current === event.relatedTarget || optionsRef.current === event.relatedTarget) {
      event.currentTarget.focus();
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchValue(event.target.value);

  return (
    <div className={`col-span-${width}`}>
      <Listbox value="" onChange={selectOption}>
        <div className="relative">
          {label && (
            <Listbox.Label
              className={classNames('font-medium text-gray-700', {
                'text-red-900': errors?.[field],
              })}
            >
              {label} {required && <span className="text-red-600">*</span>}
            </Listbox.Label>
          )}
          <Listbox.Button
            className={classNames(
              'relative w-full text-left bg-white rounded-md shadow-sm cursor-default focus:outline-none border',
              { 'border-red-600 placeholder-red-900': errors?.[field], 'mt-1': !!label },
            )}
            ref={triggerRef}
          >
            <div className="flex items-center px-3 py-2 gap-x-2">
              {!selectedValues.length && !allowAdditions && !search && (
                <div className="pl-1 gap-x-1 block truncate text-gray-500">
                  {placeHolder ?? label}
                </div>
              )}
              {selectedValues.map(({ key, text }) => (
                <div
                  key={key}
                  className={classNames('rounded pl-2 gap-x-1', {
                    'text-gray-500': !selectedValues,
                    'flex items-center bg-gray-200': multiple,
                  })}
                >
                  {text}
                  {multiple && (
                    <XIcon
                      className="h-6 w-6 px-1 rounded-r hover:bg-gray-300"
                      onClick={unselectValue(key)}
                    />
                  )}
                </div>
              ))}
              {(allowAdditions || search) && (
                <input
                  type="text"
                  ref={inputRef}
                  className="w-full focus:outline-none focus:ring-0 border-none p-0"
                  placeholder={allowAdditions ? 'Add option...' : 'Search option...'}
                  onChange={onInputChange}
                  onKeyDown={addOptionAndSelect}
                  onBlur={onInputBlur}
                />
              )}
            </div>
            {errors?.[field] && (
              <div className="absolute inset-y-0 right-5 flex items-center px-3">
                <ExclamationCircleIcon className="text-red-600 h-6 w-6" />
              </div>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className="w-5 h-5 text-gray-400" />
            </div>
          </Listbox.Button>
          <Listbox.Options
            className="z-10 absolute w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none"
            ref={optionsRef}
          >
            {!filteredOptions.length && (
              <Listbox.Option
                className="text-gray-500 cursor-default select-none relative p-2 pl-3"
                value="-1"
              >
                <span className="font-normal block truncate">No options</span>
              </Listbox.Option>
            )}
            {filteredOptions.map(({ key, text }) => {
              const optionSelected = isOptionSelected(key);

              return (
                (!multiple || !optionSelected) && (
                  <Listbox.Option
                    key={key}
                    className={classNames(
                      'text-gray-900 cursor-default select-none relative p-2 pl-3',
                      {
                        'bg-gray-200': optionSelected,
                        'hover:bg-gray-100': !optionSelected,
                      },
                    )}
                    value={key}
                  >
                    <span className="font-normal block truncate">{text}</span>
                  </Listbox.Option>
                )
              );
            })}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}

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
  width = 'none',
  required,
  clearable,
  minDate,
  maxDate,
  disabled,
  errors,
  setErrors,
  onChange,
}: DateTimeFieldProps<T>): JSX.Element {
  const today = new Date();
  const hasError = errors?.[field];

  const [isOpen, setIsOpen] = useState<boolean>();
  const [date, setDate] = useState<Date>(today);
  const [displayDate, setDisplayDate] = useState<string>();
  const [month, setMonth] = useState<number>(today.getUTCMonth());
  const [year, setYear] = useState<number>(today.getUTCFullYear());
  const [daysInMonthArr, setDaysInMonthArr] = useState<number[]>([]);
  const [yearsRange, setYearsRange] = useState<number[]>([]);
  const [blankDaysArr, setBlankDaysArr] = useState<number[]>([]);
  const [calendarView, setCalendarView] = useState<'days' | 'months' | 'years'>('days');

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months: { [id: number]: string } = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };

  const yearMonths: {
    [id: number]: {
      name: string;
      shortName: string;
      monthNumber: number;
    };
  } = {
    0: { name: 'January', shortName: 'Jan', monthNumber: 1 },
    1: { name: 'February', shortName: 'Feb', monthNumber: 2 },
    2: { name: 'March', shortName: 'Mar', monthNumber: 3 },
    3: { name: 'April', shortName: 'Apr', monthNumber: 4 },
    4: { name: 'May', shortName: 'May', monthNumber: 5 },
    5: { name: 'June', shortName: 'Jun', monthNumber: 6 },
    6: { name: 'July', shortName: 'Jul', monthNumber: 7 },
    7: { name: 'August', shortName: 'Aug', monthNumber: 8 },
    8: { name: 'September', shortName: 'Sep', monthNumber: 9 },
    9: { name: 'October', shortName: 'Oct', monthNumber: 10 },
    10: { name: 'November', shortName: 'Nov', monthNumber: 11 },
    11: { name: 'December', shortName: 'Dec', monthNumber: 12 },
  };

  const weekDays: {
    [id: number]: {
      name: string;
      shortName: string;
      weekdayNumber: number;
    };
  } = {
    0: {
      name: 'Sunday',
      shortName: 'Sun',
      weekdayNumber: 0,
    },
    1: {
      name: 'Monday',
      shortName: 'Mon',
      weekdayNumber: 1,
    },
    2: {
      name: 'Tuesday',
      shortName: 'Tue',
      weekdayNumber: 2,
    },
    3: {
      name: 'Wednesday',
      shortName: 'Wed',
      weekdayNumber: 3,
    },
    4: {
      name: 'Thursday',
      shortName: 'Thu',
      weekdayNumber: 4,
    },
    5: {
      name: 'Friday',
      shortName: 'Fri',
      weekdayNumber: 5,
    },
    6: {
      name: 'Saturday',
      shortName: 'Sat',
      weekdayNumber: 6,
    },
  };

  const setInitValue = () => {
    const today = entity[field] ? new Date(entity[field] as any) : new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const dayOfWeek = new Date(year, month).getDay();
    const weekdayNumber = weekDays[dayOfWeek].weekdayNumber;
    const newDate = new Date(year, month, today.getDate(), today.getHours(), today.getMinutes());

    // Get last day number of the previous actual month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get the number (0-6) on which the actual month starts
    const blankDaysArr: number[] = [];
    for (let i = 1; i <= weekdayNumber; i++) {
      blankDaysArr.push(i);
    }

    const daysInMonthArr: number[] = [];
    for (let i = 1; i < daysInMonth; i++) {
      daysInMonthArr.push(i);
    }

    setDate(newDate);
    entity[field] && setDisplayDate(getDisplayDate(newDate));
    setMonth(month);
    setYear(year);
    setDaysInMonthArr(daysInMonthArr);
    setBlankDaysArr(blankDaysArr);
    refreshYearRange(year);
  };

  useEffect(() => {
    setInitValue();

    const onClickListener = (event: any) => {
      if (!event.path.includes(calendarRef.current) && !event.path.includes(inputRef.current)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickListener);

    return () => {
      document.removeEventListener('mousedown', onClickListener);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setInitValue();
      setCalendarView('days');
    }
  }, [isOpen]);

  const refreshYearRange = (year: number) => {
    const yearsRangeArr: number[] = [];
    for (let i = year - 6; i < year + 6; i++) {
      yearsRangeArr.push(i);
    }
    setYearsRange(yearsRangeArr);
  };

  const editCalendarViewPage = (type: 'add' | 'subtract') => () => {
    let newYear: number = year;
    let newMonth: number = month;
    if (calendarView === 'days') {
      if (type === 'add') {
        if (month === 11) {
          newMonth = 0;
          newYear = year + 1;
        } else {
          newMonth = month + 1;
          newYear = year;
        }
      } else {
        if (month === 0) {
          newMonth = 11;
          newYear = year - 1;
        } else {
          newMonth = month - 1;
          newYear = year;
        }
      }
    } else if (calendarView === 'months') {
      newYear = year + (type === 'add' ? 1 : -1);
    } else {
      const yearsRangeArr: number[] = [];
      for (let i = 0; i < 12; i++) {
        yearsRangeArr.push(yearsRange[i] + (type === 'add' ? 12 : -12));
      }
      setYearsRange(yearsRangeArr);
    }

    const newMonthFirstWeekdayNumber = new Date(newYear, newMonth, 1).getDay();
    const firstWeekdayNumber = weekDays[newMonthFirstWeekdayNumber].weekdayNumber;
    const daysInMonth = new Date(newYear, newMonth + 1, 0).getDate();

    const blankDaysArr: number[] = [];
    for (let i = 1; i <= firstWeekdayNumber; i++) {
      blankDaysArr.push(i);
    }

    const daysInMonthArr: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysInMonthArr.push(i);
    }

    setYear(newYear);
    setMonth(newMonth);
    setDaysInMonthArr(daysInMonthArr);
    setBlankDaysArr(blankDaysArr);
  };

  const getDisplayDate = (date: Date): string => {
    const year = date.getFullYear();
    const monthShortName = yearMonths[date.getMonth()].shortName;
    const day = date.getDate().toString().padStart(2, '0');
    const dayShortName = weekDays[date.getDay()].shortName;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${dayShortName} ${day} ${monthShortName}, ${year} at ${hours}:${minutes}`;
  };

  const isEqualDate = (date1: Date, date2: Date, type: 'time' | 'day' = 'time') =>
    type === 'time'
      ? date1.getTime() === date2.getTime()
      : date1.toDateString() === date2.toDateString();

  const isGreaterThanDate = (date1: Date, date2: Date, type: 'time' | 'day' = 'time') => {
    if (type === 'day') {
      const auxDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const auxDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

      return auxDate1.getTime() > auxDate2.getTime();
    }

    return date1.getTime() > date2.getTime();
  };

  const isLessThanDate = (date1: Date, date2: Date, type: 'time' | 'day' = 'time') => {
    if (type === 'day') {
      const auxDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const auxDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

      return auxDate1.getTime() < auxDate2.getTime();
    }

    return date1.getTime() < date2.getTime();
  };

  const setDayNumber = (dayNumber: number) => () => {
    const newDate = new Date(year, month, dayNumber, date.getHours(), date.getMinutes());

    if (minDate) {
      const _minDate = new Date(minDate);
      if (
        _minDate.getFullYear() === year &&
        _minDate.getMonth() === month &&
        _minDate.getDate() === dayNumber
      ) {
        newDate.setHours(Math.max(newDate.getHours(), _minDate.getHours()));
        if (newDate.getHours() === _minDate.getHours()) {
          newDate.setMinutes(Math.max(newDate.getMinutes(), _minDate.getMinutes()));
        }
      }
    }

    if (maxDate) {
      const _maxDate = new Date(maxDate);
      if (
        _maxDate.getFullYear() === year &&
        _maxDate.getMonth() === month &&
        _maxDate.getDate() === dayNumber
      ) {
        newDate.setHours(Math.min(newDate.getHours(), _maxDate.getHours()));
        if (newDate.getHours() === _maxDate.getHours()) {
          newDate.setMinutes(Math.min(newDate.getMinutes(), _maxDate.getMinutes()));
        }
      }
    }

    setNewDate(newDate);
  };

  const editDateField = (field: 'hours' | 'minutes', diff: 1 | -1) => () => {
    const newDate = new Date(date);
    let number = 1;

    if (field === 'minutes') number = 60 * diff;
    if (field === 'hours') number = 60 * 60 * diff;

    number *= 1000;
    newDate.setTime(newDate.getTime() + number);

    if (minDate && isLessThanDate(newDate, new Date(minDate))) return;
    if (maxDate && isGreaterThanDate(newDate, new Date(maxDate))) return;

    setNewDate(newDate);
  };

  const setNewDate = (newDate: Date) => {
    setDate(newDate);
    setDisplayDate(getDisplayDate(newDate));

    entity[field] = newDate as any;
    required && setErrors?.({ ...errors, [field]: false });
    onChange?.(newDate);
  };

  const clearDate = () => {
    setDate(new Date());
    setDisplayDate(undefined);

    entity[field] = null as any;
    required && setErrors?.({ ...errors, [field]: true });
  };

  const nextCalendarView = () => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    refreshYearRange(date.getFullYear());
    if (calendarView === 'days') {
      setCalendarView('months');
    } else if (calendarView === 'months') {
      setCalendarView('years');
    } else {
      setCalendarView('days');
    }
  };

  const setMonthView = (month: number) => () => {
    setMonth(month);
    setCalendarView('days');
  };

  const setYearView = (year: number) => () => {
    setYear(year);
    setCalendarView('months');
  };

  const increaseHours = useLongPress(editDateField('hours', 1));
  const decreaseHours = useLongPress(editDateField('hours', -1));
  const increaseMinutes = useLongPress(editDateField('minutes', 1));
  const decreaseMinutes = useLongPress(editDateField('minutes', -1));

  return (
    <div
      className={classNames(`flex flex-col col-span-${width}`, {
        'opacity-50': disabled,
      })}
    >
      {label && (
        <label
          className={classNames('font-medium text-gray-700', {
            'text-red-900': hasError,
          })}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          readOnly
          ref={inputRef}
          disabled={disabled}
          value={displayDate ?? ''}
          onClick={() => setIsOpen(!isOpen)}
          className={classNames('w-full border border-gray-300 rounded-md shadow-sm', {
            'border-red-600 placeholder-red-900 opacity-70': hasError,
          })}
          placeholder={placeHolder ?? label ?? 'Select date'}
        />

        {hasError ? (
          <div className="absolute inset-y-0 right-0 flex items-center px-3">
            <ExclamationCircleIcon className="text-red-600 h-6 w-6" />
          </div>
        ) : (
          clearable &&
          displayDate && (
            <div
              className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
              onClick={clearDate}
            >
              <XIcon className="h-6 w-6 text-gray-500" />
            </div>
          )
        )}

        {isOpen && (
          <div className="relative z-10">
            <div
              className="flex flex-col duration-200 mt-1 bg-white border rounded-md shadow absolute origin-top-left"
              ref={calendarRef}
            >
              <div className="select-none">
                <div className="flex pt-2 px-3">
                  <div
                    className="flex items-center transition ease-in-out duration-100 cursor-pointer rounded-full px-2 py-1 -ml-1 hover:bg-gray-100"
                    onClick={nextCalendarView}
                  >
                    {calendarView === 'years' && (
                      <ChevronLeftIcon className="h-5 w-5 text-gray-400" />
                    )}
                    {calendarView === 'days' && <span>{months[month]}</span>}
                    {calendarView !== 'years' ? (
                      <>
                        <span className="text-gray-500 ml-1">{year}</span>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </>
                    ) : (
                      <span className="text-gray-500 ml-1">
                        {yearsRange[0]} - {yearsRange[11]}
                      </span>
                    )}
                  </div>
                  <div
                    className="transition ease-in-out duration-100 cursor-pointer rounded-full p-1 ml-auto hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={editCalendarViewPage('subtract')}
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div
                    className="transition ease-in-out duration-100 cursor-pointer rounded-full p-1 -mr-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={editCalendarViewPage('add')}
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                {calendarView === 'days' ? (
                  <div className="px-3 py-2">
                    <div className="grid grid-cols-7">
                      {days.map((day, index) => (
                        <span
                          key={index}
                          className="uppercase text-xs text-gray-500 w-8 h-8 flex items-center justify-center"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {blankDaysArr.map((day) => (
                        <div key={day} className="w-full h-8 flex items-center" />
                      ))}
                      {daysInMonthArr.map((dayNumber, index) => {
                        const dayDate = new Date(year, month, dayNumber);
                        const isDaySelectable =
                          (!minDate || !isLessThanDate(dayDate, new Date(minDate), 'day')) &&
                          (!maxDate || !isGreaterThanDate(dayDate, new Date(maxDate), 'day'));
                        const isEqualSelectedDate =
                          entity[field] &&
                          isEqualDate(dayDate, new Date(entity[field] as any), 'day');
                        const isEqualToday = isEqualDate(dayDate, new Date(), 'day');

                        return (
                          <div
                            key={index}
                            className={classNames(
                              'flex items-center justify-center text-sm rounded-full w-8 h-8 mx-auto',
                              {
                                'border border-blue-500': isEqualToday,
                                'bg-blue-500 text-white': isEqualSelectedDate,
                                'cursor-pointer': isDaySelectable,
                                'hover:bg-blue-100': isDaySelectable && !isEqualSelectedDate,
                                'text-gray-400 bg-white': !isDaySelectable,
                              },
                            )}
                            onClick={isDaySelectable ? setDayNumber(dayNumber) : undefined}
                          >
                            {dayNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : calendarView === 'months' ? (
                  <div className="px-3 py-2 grid grid-cols-4">
                    {Object.values(yearMonths).map(({ shortName }, index) => {
                      const today = new Date();
                      const isEqualThisMonth =
                        year === today.getFullYear() && index === today.getMonth();
                      const isEqualSelectedMonth =
                        entity[field] && year === date.getFullYear() && index === date.getMonth();
                      const monthDate = new Date(
                        year,
                        index,
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes(),
                      );
                      const isMonthSelectable =
                        (!minDate || !isLessThanDate(monthDate, new Date(minDate), 'day')) &&
                        (!maxDate || !isGreaterThanDate(monthDate, new Date(maxDate), 'day'));

                      return (
                        <div
                          key={index}
                          className={classNames(
                            'flex items-center justify-center w-14 py-3 text-sm rounded mx-auto border',
                            {
                              'border-blue-500': isEqualThisMonth,
                              'border-transparent': !isEqualThisMonth,
                              'bg-blue-500 text-white': isEqualSelectedMonth,
                              'cursor-pointer': isMonthSelectable,
                              'hover:bg-blue-100': isMonthSelectable && !isEqualSelectedMonth,
                              'text-gray-400 bg-white': !isMonthSelectable,
                            },
                          )}
                          onClick={setMonthView(index)}
                        >
                          {shortName}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-2 grid grid-cols-4">
                    {yearsRange.map((yearNumber) => {
                      const today = new Date();
                      const isEqualThisYear = yearNumber === today.getFullYear();
                      const isEqualSelectedYear =
                        entity[field] && yearNumber === date.getFullYear();
                      const yearDate = new Date(
                        yearNumber,
                        date.getMonth(),
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes(),
                      );
                      const isYearSelectable =
                        (!minDate || !isLessThanDate(yearDate, new Date(minDate), 'day')) &&
                        (!maxDate || !isGreaterThanDate(yearDate, new Date(maxDate), 'day'));

                      return (
                        <div
                          key={yearNumber}
                          className={classNames(
                            'flex items-center justify-center w-14 py-3 text-sm rounded mx-auto border',
                            {
                              'border-blue-500': isEqualThisYear,
                              'border-transparent': !isEqualThisYear,
                              'bg-blue-500 text-white': isEqualSelectedYear,
                              'cursor-pointer': isYearSelectable,
                              'hover:bg-blue-100': isYearSelectable && !isEqualSelectedYear,
                              'text-gray-400 bg-white': !isYearSelectable,
                            },
                          )}
                          onClick={setYearView(yearNumber)}
                        >
                          {yearNumber}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {calendarView === 'days' && (
                <div className="flex items-center justify-between px-4 py-2 select-none">
                  <label className="text-sm text-gray-700">Time</label>
                  <div className="flex space-x-2">
                    <div className="flex flex-col items-center justify-center">
                      <ChevronUpIcon
                        className="h-4 w-4 hover:bg-gray-200"
                        onClick={editDateField('hours', 1)}
                        {...increaseHours}
                      />
                      <ChevronDownIcon
                        className="h-4 w-4 hover:bg-gray-200"
                        onClick={editDateField('hours', -1)}
                        {...decreaseHours}
                      />
                    </div>
                    <div className="bg-gray-100 rounded-md w-full text-right flex items-center border border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50">
                      <input
                        disabled
                        type="number"
                        value={date.getHours().toString().padStart(2, '0')}
                        className="text-center p-0 w-8 h-8 bg-transparent text-sm border border-transparent"
                      />
                      <span className="">:</span>
                      <input
                        disabled
                        type="number"
                        value={date.getMinutes().toString().padStart(2, '0')}
                        className="text-center p-0 w-8 h-8 bg-transparent text-sm border border-transparent"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <ChevronUpIcon
                        className="h-4 w-4 hover:bg-gray-200"
                        onClick={editDateField('minutes', 1)}
                        {...increaseMinutes}
                      />
                      <ChevronDownIcon
                        className="h-4 w-4 hover:bg-gray-200"
                        onClick={editDateField('minutes', -1)}
                        {...decreaseMinutes}
                      />
                    </div>
                  </div>
                  <div
                    className="text-blue-600 text-sm uppercase font-bold transition duration-100 ease-in-out border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 rounded cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    OK
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const LabeledInput: React.FC<{
  label?: string;
  hasError?: boolean;
  required?: boolean;
  width?: ColSpanWidth;
  input: (classNames: string) => JSX.Element;
}> = ({ children, label, hasError, required, width = 'none', input }) => (
  <div className={`col-span-${width}`}>
    {label && (
      <label
        className={classNames('font-medium text-gray-700', {
          'text-red-900': hasError,
        })}
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
    )}
    <div className={classNames('relative', { 'mt-1': !!label })}>
      {input(
        classNames('w-full border border-gray-300 rounded-md shadow-sm', {
          'border-red-600 placeholder-red-900 opacity-70': hasError,
        }),
      )}
      {children}
      {hasError && (
        <div className="absolute inset-y-0 right-0 flex items-center px-3">
          <ExclamationCircleIcon className="text-red-600 h-6 w-6" />
        </div>
      )}
    </div>
  </div>
);
