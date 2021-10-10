import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';
import Tooltip from '../tooltip/Tooltip';

type Props = {
  label?: string;
  description?: React.ReactNode;
  required?: boolean;
  hasErrors?: boolean;
};

const Label: React.FC<Props> = ({ label, description, required, hasErrors }) => {
  return !label ? null : (
    <label
      className={classNames(
        'flex items-center gap-1 font-medium text-gray-700 dark:text-gray-100',
        {
          'text-red-900 dark:text-red-500': hasErrors,
        }
      )}
    >
      <span>
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {description && (
        <Tooltip content={<div className="max-w-xs">{description}</div>} position="top">
          <QuestionMarkCircleIcon className="h-4 w-4" />
        </Tooltip>
      )}
    </label>
  );
};

export default Label;
