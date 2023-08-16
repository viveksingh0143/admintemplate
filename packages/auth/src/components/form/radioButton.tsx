import React from 'react';
import InputOption, { InputOptionProps } from './inputOption';

type RadioButtonProps = Omit<InputOptionProps, "type">;

const RadioButton: React.FC<RadioButtonProps> = ({ name, label, required, className, labelClassName, inputClassName, ...props }) => {
  return (
    <InputOption type="radio" name={name} label={label} required={required} className={className} label-class-name={labelClassName} inputClassName={inputClassName} {...props} />
  );
};

export default RadioButton;