import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type SelectProps<T extends Record<string, string> = {}> = {
  name: string;
  label: string;
  options: T[] | string[];
  labelKey?: keyof T;
  valueKey?: keyof T;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  hideLabel?: boolean;
} & React.ComponentProps<'select'>;

const Select = <T extends Record<string, string> = {}>({
  name,
  label,
  options,
  labelKey = 'label',
  valueKey = 'value',
  required,
  className = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  hideLabel = false,
  ...props
}: SelectProps<T>) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={classNames('mb-4', className)}>
      { !hideLabel && (
        <label htmlFor={name} className={classNames('block text-sm font-medium text-gray-500', labelClassName)}>
          {label}
        </label>
      )}
      <select
        id={name}
        {...register(name)}
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