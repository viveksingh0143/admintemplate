import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type InputProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
} & React.ComponentProps<'input'>;

const Input: React.FC<InputProps> = ({
  name,
  label,
  required,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={classNames('mb-4', className)}>
      <label className={classNames('block text-sm font-medium text-gray-700', labelClassName)}>{label}</label>
      <input {...register(name, { required })} className={classNames('placeholder:text-slate-400 mt-1 p-2 w-full border rounded-md', inputClassName)} {...props} />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <span className={classNames('text-red-500 text-xs', errorClassName)}>{message}</span>}
      />
    </div>
  );
};

export default Input;