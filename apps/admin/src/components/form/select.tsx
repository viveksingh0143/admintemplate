import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type SelectProps<T extends { [K in LabelKey | ValueKey]: string }, LabelKey extends keyof T = keyof T, ValueKey extends keyof T = keyof T> = {
  name: string;
  label: string;
  options: T[] | string[];
  labelKey?: LabelKey;
  valueKey?: ValueKey;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  hideLabel?: boolean;
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
  hideLabel = false,
  ...props
}: SelectProps<T, LabelKey, ValueKey>) => {
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
              value={typeof option === 'string' ? option : (option[valueKey as keyof typeof option])}
            >
              {typeof option === 'string' ? option : (option[labelKey as keyof typeof option])}
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