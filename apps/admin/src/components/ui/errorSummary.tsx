import React, { ReactNode } from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';

type ErrorSummaryProps<T extends FieldValues> = {
  errors: FieldErrors<T>;
};

const ErrorSummary = <T extends FieldValues>({ errors }: ErrorSummaryProps<T>): ReactNode => {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="error-summary">
      {Object.keys(errors).map((fieldName) => {
        const errorMessage = errors[fieldName]?.message;
        const errorType = errors[fieldName]?.type;
        return errorMessage ? <div key={fieldName}><strong>{fieldName}:</strong> {errorMessage as ReactNode} - {errorType as ReactNode}</div> : null;
      })}
    </div>
  );
};

export default ErrorSummary;
