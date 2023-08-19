import React from 'react';
import { FormProvider } from 'react-hook-form';
import * as zod from 'zod';
import { classNames } from '@lib/utils';
import useEasyForm from './useEasyForm';

type FormProps<T extends zod.ZodSchema<any>> = {
  methods: ReturnType<typeof useEasyForm>;
  onSubmit: (data: zod.infer<T>) => void;
  children: React.ReactNode;
  className?: string;
};

const Form = <T extends zod.ZodSchema<any>>({ methods, onSubmit, children, className, }: FormProps<T>) => {
  const { formState: { isLoading, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={classNames('space-y-4', className)}>
        {/* <div>
          isLoading: {isLoading}, isSubmitting: {isSubmitting}, isSubmitted: {isSubmitted}, isSubmitSuccessful: {isSubmitSuccessful}, submitCount: {submitCount}
        </div> */}
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;