import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { classNames } from '@lib/utils';

type TextareaProps = {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
} & React.ComponentProps<'textarea'>;

const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  required,
  className = '',
  labelClassName = '',
  textareaClassName = '',
  errorClassName = '',
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={classNames('mb-4', className)}>
      <label className={classNames('block text-sm font-medium text-gray-700', labelClassName)}>{label}</label>
      <textarea {...register(name, { required })} className={classNames('mt-1 p-2 w-full border rounded-md', textareaClassName)} {...props}></textarea>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <span className={classNames('text-red-500 text-xs', errorClassName)}>{message}</span>}
      />
    </div>
  );
};

export default Textarea;
