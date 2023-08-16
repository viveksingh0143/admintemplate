import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type SwitchProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
} & React.ComponentProps<'input'>;

const Switch: React.FC<SwitchProps> = ({
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
    <div className={classNames('mb-4 flex items-center', className)}>
      <input type="checkbox" {...register(name, { required })} className={classNames('mr-2', inputClassName)} {...props} />
      <label className={classNames('block text-sm font-medium text-gray-700', labelClassName)}>{label}</label>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <span className={classNames('text-red-500 text-xs', errorClassName)}>{message}</span>}
      />
    </div>
  );
};

export default Switch;