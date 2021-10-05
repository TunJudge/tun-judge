import { Listbox } from '@headlessui/react';
import { ExclamationCircleIcon, SelectorIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEmpty } from '../../../core/helpers';
import { BasicInputProps } from './BasicInput';
import Label from './Label';
import { EntityFieldInputProps } from './types';

type Props<T, R> = EntityFieldInputProps<T, R> & {
  options?: R[];
  optionsIdField?: string;
  optionsTextField?: string;
  optionsValueField?: string;
  search?: boolean;
  multiple?: boolean;
  allowAdditions?: boolean;
} & BasicInputProps;

type Option<T> = { key: string; text: string; value: T };

function DropDownInput<T, R = any>({
  entity,
  field,
  label,
  placeHolder,
  width = 'none',
  required,
  readOnly,
  defaultTouched,
  options,
  optionsIdField,
  optionsTextField,
  optionsValueField,
  search,
  multiple,
  allowAdditions,
  description,
  errors,
  setErrors,
  onChange,
}: Props<T, R>): JSX.Element {
  const [optionsState, setOptions] = useState<Option<R>[]>([]);
  const [selectedValues, setSelectedValues] = useState<{ key: string; text: string }[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<Option<R>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [touched, setTouched] = useState(defaultTouched);
  const hasErrors = useMemo(
    () => touched && errors?.[field],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [touched, errors, field, errors?.[field]],
  );

  useEffect(() => {
    setOptions(
      (options ?? (entity[field] as any) ?? []).map((value: any) =>
        typeof value === 'object'
          ? {
              key: value[optionsIdField ?? 'id'],
              text: value[optionsTextField ?? 'id'],
              value: optionsValueField ? value[optionsValueField] : value,
            }
          : {
              key: value,
              text: value,
              value: value,
            },
      ),
    );
  }, [entity, field, options, optionsIdField, optionsTextField, optionsValueField]);

  const refreshSelectedValues = useCallback(
    () =>
      setSelectedValues(
        multiple
          ? ((entity[field] as any) ?? []).map((value: any) =>
              typeof value === 'object'
                ? {
                    key: value[optionsIdField ?? 'id'],
                    text:
                      optionsState.find((option) => option.key === value[optionsIdField ?? 'id'])
                        ?.text ?? value[optionsTextField ?? 'id'],
                  }
                : {
                    key: value,
                    text:
                      optionsState.find((option) => option.key === value)?.text ??
                      value[optionsTextField ?? 'id'],
                  },
            )
          : typeof entity?.[field] === 'object'
          ? [
              {
                key: (entity[field] as any)[optionsIdField ?? 'id'],
                text:
                  optionsState.find(
                    (option) => option.key === (entity[field] as any)[optionsIdField ?? 'id'],
                  )?.text ?? (entity[field] as any)[optionsTextField ?? 'id'],
              },
            ]
          : entity[field]
          ? [
              {
                key: entity[field],
                text:
                  optionsState.find((option) => option.key === (entity[field] as any))?.text ??
                  entity[field],
              },
            ]
          : [],
      ),
    [entity, field, optionsState, multiple, optionsIdField, optionsTextField],
  );

  useEffect(() => {
    refreshSelectedValues();
  }, [refreshSelectedValues]);

  const isOptionSelected = useCallback(
    (key: string) =>
      multiple
        ? !!((entity[field] as any) ?? []).find(
            (value: any) =>
              (typeof value === 'object' ? value[optionsIdField ?? 'id'] : value) === key,
          )
        : typeof entity?.[field] === 'object'
        ? (entity[field] as any)[optionsIdField ?? 'id'] === key
        : (entity[field] as any) === key,
    [entity, field, multiple, optionsIdField],
  );

  const refreshFilteredOptions = useCallback(
    () =>
      setFilteredOptions(
        optionsState.filter(
          ({ key, text }) =>
            !search || (!isOptionSelected(key) && text.includes(searchValue.trim())),
        ),
      ),
    [isOptionSelected, optionsState, search, searchValue],
  );

  useEffect(() => {
    refreshFilteredOptions();
  }, [refreshFilteredOptions]);

  const selectOption = (key: string, value?: any) => {
    if (key === '-1' || isOptionSelected(key)) return;

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
      setErrors?.({ ...errors, [field]: false });
    }
    onChange?.(entity[field] as any);
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
      setErrors?.({ ...errors, [field]: false });
    }
    onChange?.(entity[field] as any);
  };

  const addOptionAndSelect = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.currentTarget.value;
    if (event.key === 'Enter' && value) {
      if (!filteredOptions.length && allowAdditions) {
        setOptions([...optionsState, { key: value, value: value as any, text: value }]);
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
    <div
      className={classNames({
        'col-span-1': width === '1',
        'col-span-2': width === '2',
        'col-span-3': width === '3',
        'col-span-4': width === '4',
        'col-span-5': width === '5',
        'col-span-6': width === '6',
        'col-span-7': width === '7',
        'col-span-8': width === '8',
        'col-span-9': width === '9',
        'col-span-10': width === '10',
        'col-span-11': width === '11',
        'col-span-12': width === '12',
        'col-span-13': width === '13',
        'col-span-14': width === '14',
        'col-span-15': width === '15',
        'col-span-16': width === '16',
        'col-span-none': width === 'none',
      })}
    >
      <Listbox value="" onChange={selectOption} disabled={readOnly}>
        <div className="relative" onBlur={() => setTouched(true)}>
          <Label
            label={label}
            description={description}
            required={required}
            hasErrors={touched && hasErrors}
          />
          <Listbox.Button
            className={classNames(
              'relative h-11 w-full text-left bg-white rounded-md shadow-sm cursor-default focus:outline-none border border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-600',
              {
                'border-red-600 placeholder-red-900 opacity-70 dark:border-red-500 dark:placeholder-red-500':
                  hasErrors,
                'mt-1': !!label,
              },
            )}
            ref={triggerRef}
          >
            <div className="flex flex-wrap items-center px-3 gap-2">
              {!selectedValues.length && !allowAdditions && !search && (
                <div className="pl-1 gap-x-1 block truncate text-gray-500 dark:text-gray-400">
                  {placeHolder ?? label}
                </div>
              )}
              {selectedValues.map(({ key, text }) => (
                <div
                  key={key}
                  className={classNames({
                    'text-gray-500': !selectedValues,
                    'flex items-center py-1 pl-2 rounded bg-gray-200 dark:bg-gray-800 text-sm':
                      multiple,
                  })}
                >
                  {text}
                  {multiple && (
                    <XIcon
                      className="h-4 w-4 mx-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                      onClick={unselectValue(key)}
                    />
                  )}
                </div>
              ))}
              {(allowAdditions || search) && (
                <input
                  type="text"
                  ref={inputRef}
                  className="max-w-full focus:outline-none focus:ring-0 border-none p-0 bg-transparent dark:placeholder-gray-400"
                  placeholder={allowAdditions ? 'Add option...' : 'Search option...'}
                  onChange={onInputChange}
                  onKeyDown={addOptionAndSelect}
                  onBlur={onInputBlur}
                />
              )}
            </div>
            {hasErrors && (
              <div className="absolute inset-y-0 right-5 flex items-center px-3">
                <ExclamationCircleIcon className="text-red-600 h-6 w-6" />
              </div>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className="w-5 h-5 text-gray-400" />
            </div>
          </Listbox.Button>
          <Listbox.Options
            className="z-20 absolute w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700"
            ref={optionsRef}
          >
            {!filteredOptions.length && (
              <Listbox.Option
                className="text-gray-500 cursor-default select-none relative p-2 pl-3 dark:text-gray-200"
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
                      'text-gray-900 cursor-default select-none relative p-2 pl-3 dark:text-gray-200',
                      {
                        'bg-gray-200 dark:bg-gray-500': optionSelected,
                        'hover:bg-gray-100 dark:hover:bg-gray-600': !optionSelected,
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

export default DropDownInput;
