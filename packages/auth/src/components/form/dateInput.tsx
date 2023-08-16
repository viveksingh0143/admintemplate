import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DateInputProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
} & React.ComponentProps<typeof DatePicker>;

const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  required,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  onChange, // Destructure onChange here
  ...props // Other props excluding onChange
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const value = watch(name);

  const handleChange = (date: Date, event: React.SyntheticEvent<any, Event> | undefined) => {
    setValue(name, date);
    if (onChange) {
      onChange(date, event); // Call the custom onChange handler if provided
    }
  };

  return (
    <div className={classNames('mb-4', className)}>
      <label className={classNames('block text-sm font-medium text-gray-700', labelClassName)}>{label}</label>
      <DatePicker
        selected={value}
        onChange={handleChange} // Use the custom handleChange function
        className={classNames('mt-1 p-2 w-full border rounded-md', inputClassName)}
        {...props} // Spread other props excluding onChange
      />
      <input type="hidden" {...register(name, { required })} />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <span className={classNames('text-red-500 text-xs', errorClassName)}>{message}</span>}
      />
    </div>
  );
};

export default DateInput;