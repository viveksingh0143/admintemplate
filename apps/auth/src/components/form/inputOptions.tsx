import { ComponentProps } from 'react';
import InputOption from './inputOption';
import { classNames } from '@lib/utils';

type Option = string | { [key: string]: string };

type InputOptionsProps<T extends Option> = {
  type: 'checkbox' | 'radio';
  name: string;
  label?: string;
  helpText?: string;
  legend?: string;
  options: T[];
  valueKey?: keyof T;
  labelKey?: keyof T;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
} & ComponentProps<'input'>;

const InputOptions = <T extends Option>({
  type,
  name,
  label: mainLabel,
  helpText,
  legend,
  options,
  labelKey = 'label' as keyof T,
  required,
  orientation = 'horizontal',
  className,
  labelClassName,
  inputClassName,
  ...props
}: InputOptionsProps<T>) => {
  const orientationClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={classNames("space-y-4", className)}>
      {mainLabel && <label className={classNames("text-base font-semibold text-gray-900", labelClassName)}>{mainLabel}</label>}
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      <fieldset className={`mt-4 ${orientationClass}`}>
        {legend && <legend className="sr-only">{legend}</legend>}
        <div className="space-y-4">
          {options.map((option, index) => (
            <InputOption
              key={index}
              type={type}
              name={name}
              label={typeof option === 'string' ? option : String(option[labelKey])}
              required={required}
              className={className}
              inputClassName={inputClassName}
              {...props}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default InputOptions;