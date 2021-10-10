import { ExclamationCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { useState } from 'react';
import Label from './Label';
import { NumberInputProps } from './NumberInput';
import { TextInputProps } from './TextInput';
import { ColSpanWidth } from './types';

export type BasicInputProps = {
  type?: string;
  label?: string;
  description?: React.ReactNode;
  autoComplete?: string;
  placeHolder?: string;
  value?: any;
  defaultValue?: any;
  width?: ColSpanWidth;
  required?: boolean;
  readOnly?: boolean;
  defaultTouched?: boolean;
};

type InputProps = BasicInputProps & {
  textarea?: boolean;
  hasErrors?: boolean;
  icon?: React.FC<React.ComponentProps<'svg'>>;
  onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

type FullInputProps = InputProps & TextInputProps & NumberInputProps;

const BasicInput: React.FC<FullInputProps> = ({
  textarea,
  type,
  label,
  autoComplete,
  placeHolder,
  value,
  defaultValue,
  width = 'none',
  required,
  readOnly,
  defaultTouched,
  description,
  pattern,
  onClick,
  onChange,
  hasErrors,
  min,
  max,
  step,
  icon: ExtraIcon,
}) => {
  const [touched, setTouched] = useState(defaultTouched);

  const onBlur = () => setTouched(true);

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
      {type !== 'checkbox' && (
        <Label
          label={label}
          description={description}
          required={required}
          hasErrors={touched && hasErrors}
        />
      )}
      <div
        className={classNames('relative', {
          'mt-1': !!label,
          'flex items-center h-8': type === 'checkbox',
        })}
      >
        {textarea ? (
          <textarea
            className={classNames(
              '-mb-2 w-full border border-gray-300 rounded-md shadow-sm dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400',
              {
                'border-red-600 placeholder-red-900 opacity-70 dark:border-red-500 dark:placeholder-red-500':
                  touched && hasErrors,
              }
            )}
            required={required}
            readOnly={readOnly}
            placeholder={placeHolder ?? label}
            autoComplete={autoComplete}
            defaultValue={defaultValue}
            onBlur={onBlur}
            onClick={onClick}
            onChange={onChange}
          />
        ) : type === 'checkbox' ? (
          <input
            className="h-5 w-5 text-blue-600 border-gray-300 rounded"
            type="checkbox"
            required={required}
            readOnly={readOnly}
            defaultChecked={defaultValue}
            onClick={onClick}
            onChange={onChange}
          />
        ) : (
          <input
            className={classNames(
              'h-11 w-full border border-gray-300 rounded-md shadow-sm dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400',
              {
                'border-red-600 placeholder-red-900 opacity-70 dark:border-red-500 dark:placeholder-red-500':
                  touched && hasErrors,
              }
            )}
            required={required}
            readOnly={readOnly}
            pattern={pattern}
            type={type ?? 'text'}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            placeholder={placeHolder ?? label}
            value={value}
            defaultValue={defaultValue}
            onBlur={onBlur}
            onClick={onClick}
            onChange={onChange}
          />
        )}
        {type == 'checkbox' && (
          <div className="ml-2">
            <Label
              label={label}
              description={description}
              required={required}
              hasErrors={touched && hasErrors}
            />
          </div>
        )}
        {type !== 'checkbox' && (
          <div className="absolute inset-y-0 right-0 flex items-center px-3 gap-x-1">
            {touched && hasErrors && (
              <ExclamationCircleIcon className="text-red-600 dark:text-red-500 h-6 w-6" />
            )}
            {ExtraIcon && <ExtraIcon className="h-6 w-6 text-gray-400" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInput;
