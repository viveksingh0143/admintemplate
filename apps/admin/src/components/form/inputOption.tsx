import { classNames } from '@lib/utils';
import React, { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';

export type InputOptionProps = {
  type: 'checkbox' | 'radio';
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
} & ComponentProps<'input'>;

const InputOption: React.FC<InputOptionProps> = ({
  type,
  name,
  label,
  required,
  className,
  labelClassName,
  inputClassName,
  id,
  ...props
}) => {
  const { register } = useFormContext();
  const fieldId = id ? id : name;

  return (
    <div className={classNames("flex items-center", className)}>
      <input
        id={fieldId}
        type={type}
        {...register(name, { required })}
        {...props}
        className={classNames("h-4 w-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500", inputClassName)}
      />
      {label && (
        <label htmlFor={fieldId} className={classNames("ml-3 text-sm font-medium text-gray-900", labelClassName)}>
          {label}
        </label>
      )}
    </div>
  );
};

export default InputOption;