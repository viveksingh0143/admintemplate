import React from 'react';

type SelectBasicProps<T extends Record<string, string | number> = {}> = {
  name: string;
  label?: string;
  options: T[] | (string | number)[];
  labelKey?: keyof T;
  valueKey?: keyof T;
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  hideLabel?: boolean;
} & React.ComponentProps<'select'>;

const SelectBasic = <T extends Record<string, string | number> = {}>({
  name,
  label,
  options,
  labelKey = 'label',
  valueKey = 'value',
  value,
  onValueChange,
  required,
  className = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  hideLabel = false,
  ...props
}: SelectBasicProps<T>) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    const numericVal = parseFloat(val);

    // If the value is numeric, pass it as a number
    onValueChange && onValueChange(Number.isNaN(numericVal) ? val : numericVal);
  };

  return (
    <div className={`${className}`}>
      {!hideLabel && (
        <label htmlFor={name} className={`block text-sm font-medium text-gray-500 ${labelClassName}`}>
          {label}
        </label>
      )}
      <select
        id={name}
        value={value}
        onChange={handleChange}
        className={`w-full border rounded-md ${selectClassName}`}
        {...props}
      >
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option
              key={index}
              value={typeof option === 'object' ? option[valueKey] : option}
            >
              {typeof option === 'object' ? option[labelKey] : option}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SelectBasic;
