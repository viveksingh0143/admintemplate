import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { classNames } from '@lib/utils';
import React from 'react';

type LoadingOverlayProps = {
  isLoading: boolean;
  loaderIcon?: boolean;
  loaderText?: string;
  fullPage?: boolean;
  className?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, loaderText, className, loaderIcon=true, fullPage=false }) => {
  if (!isLoading) return null;

  const loaderSize = fullPage ? "fixed h-full w-full top-0 left-0" : "absolute";

  return (
    <div className={classNames(loaderSize, "inset-0 flex items-center justify-center bg-primary-900 bg-opacity-25 z-50", className)}>
        {loaderIcon && <ArrowPathIcon className="animate-spin h-10 w-10 mr-2 inline-block" />}
        {loaderText && <div>{ loaderText }</div>}
    </div>
  );
};

export default LoadingOverlay;
