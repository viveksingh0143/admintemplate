import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type SelectProps<T extends { [K in LabelKey | ValueKey]: string }, LabelKey extends keyof T = keyof T, ValueKey extends keyof T = keyof T> = {
  name: string;
  label: string;
  options: T[] | string[];
  labelKey?: LabelKey; // Property to use for label if options are objects
  valueKey?: ValueKey; // Property to use for value if options are objects
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
} & React.ComponentProps<'select'>;

const Select = <T extends { [K in LabelKey | ValueKey]: string }, LabelKey extends keyof T = keyof T, ValueKey extends keyof T = keyof T>({
  name,
  label,
  options,
  labelKey = 'label' as LabelKey,
  valueKey = 'value' as ValueKey,
  required,
  className = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  ...props
}: SelectProps<T, LabelKey, ValueKey>) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={classNames('mb-4', className)}>
      <label htmlFor={name} className={classNames('block text-sm font-medium text-gray-700', labelClassName)}>
        {label}
      </label>
      <select
        id={name}
        {...register(name, { required })}
        className={classNames('mt-1 p-2 w-full border rounded-md', selectClassName)}
        {...props}
      >
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option
              key={index}
              value={typeof option === 'string' ? option : option[valueKey]}
            >
              {typeof option === 'string' ? option : option[labelKey]}
            </option>
          ))}
      </select>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <span className={classNames('text-red-500 text-xs', errorClassName)}>{message}</span>}
      />
    </div>
  );
};

export default Select;