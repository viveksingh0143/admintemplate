import React, { ComponentProps } from 'react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { classNames } from '@lib/utils';
import { CommonVariant } from '@ctypes/common';

type ButtonCommonProps = Omit<ComponentProps<'button'>, "children"> & {
  variant: CommonVariant;
  onClick?: any;
  loading?: boolean;
  loadingText?: string;
};

type ButtonChildrenProps = {
  children: React.ReactNode;
} & ButtonCommonProps;

type ButtonInlineProps = {
  icon?: React.ReactNode;
  label?: string;
} & ButtonCommonProps;

export type ButtonProps = ButtonChildrenProps | ButtonInlineProps;

const Button: React.FC<ButtonProps> = (props) => {
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-800 focus-visible:outline-primary",
    secondary: "bg-secondary text-white hover:bg-secondary-800 focus-visible:outline-secondary",
    success: "bg-success text-white hover:bg-success-800 focus-visible:outline-success",
    warning: "bg-warning text-white hover:bg-warning-800 focus-visible:outline-warning",
    info: "bg-info text-white hover:bg-info-800 focus-visible:outline-info",
    danger: "bg-danger text-white hover:bg-danger-800 focus-visible:outline-danger",
    none: "",
  }[props.variant];
  
  const renderChildren = () => {
    if ('label' in props && props.label || 'icon' in props && props.icon) {
      return (
        <>
          {props.icon && props.icon}
          {props.label && props.label}
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
