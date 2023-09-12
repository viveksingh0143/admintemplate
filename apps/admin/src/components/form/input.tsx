import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type InputProps = {
  name: string;
  label: string;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
} & React.ComponentProps<'input'>;

const Input: React.FC<InputProps> = ({
  type = "text",
  name,
  label,
  required,
  hideLabel = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();
  let options = {};
  if (type === "number") {
    options = {
      valueAsNumber: true
    };
  } else if (type === "date") {
    options = {
      valueAsDate: true
    };
  }

  if (type === "hidden") {
    <input type={type} {...register(name, options)}  {...props} />
  } else {
    return (
      <div className={classNames('mb-4', className)}>
        { !hideLabel && (<label className={classNames('block text-sm font-medium text-gray-500', labelClassName)}>{label}</label>) }
        <input type={type} {...register(name, options)} className={classNames('placeholder:text-slate-400 focus:ring-primary-500 focus:border-primary-500 mt-1 p-2 w-full border rounded-md', inputClassName)} {...props} />
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <span className={classNames('text-danger-500 text-xs', errorClassName)}>{message}</span>}
        />
      </div>
    );
  }
};

export default Input;