import React, { ComponentProps } from 'react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { classNames } from '@lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'success';

type ButtonCommonProps = Omit<ComponentProps<'button'>, "children"> & {
  variant: ButtonVariant;
  onClick?: () => void;
  loading?: boolean;
  loadingText?: string;
};

type ButtonChildrenProps = {
  children: React.ReactNode;
} & ButtonCommonProps;

type ButtonInlineProps = {
  icon?: React.ReactNode;
  label: string;
} & ButtonCommonProps;

type ButtonProps = ButtonChildrenProps | ButtonInlineProps;

const Button: React.FC<ButtonProps> = (props) => {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:outline-secondary-600',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus-visible:outline-warning-600',
    success: 'bg-success-600 text-white hover:bg-success-700 focus-visible:outline-success-600',
  }[props.variant];

  const renderChildren = () => {
    if ('label' in props && props.label) {
      return (
        <>
          {props.icon && props.icon}
          {props.label}
        </>
      );
    } else if ('children' in props) {
      return props.children;
    }
  };

  return (
    <button
      className={classNames('px-4 py-2 rounded-lg text-sm font-medium leading-6 shadow-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', variantClasses, props.className)}
      disabled={props.loading}
      onClick={props.onClick}
    >
      {props.loading ? (
        <>
          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2 inline-block" />
          {props.loadingText}
        </>
      ) : renderChildren()}
    </button>
  );
};

export default Button;
