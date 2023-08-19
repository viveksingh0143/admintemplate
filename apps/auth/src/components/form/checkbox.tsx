import React from 'react';
import InputOption, { InputOptionProps } from './inputOption';

type CheckboxProps = Omit<InputOptionProps, "type">;

const Checkbox: React.FC<CheckboxProps> = ({ name, label, required, className, labelClassName, inputClassName, ...props }) => {
  return (
    <InputOption type="checkbox" name={name} label={label} required={required} className={className} label-class-name={labelClassName} inputClassName={inputClassName} {...props} />
  );
};

export default Checkbox;