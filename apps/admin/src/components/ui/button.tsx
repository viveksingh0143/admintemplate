import React, { ComponentProps } from 'react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { classNames } from '@lib/utils';
import { CommonVariant } from '@ctypes/common';

type ButtonCommonProps = Omit<ComponentProps<'button'>, "children"> & {
  variant: CommonVariant;
  onClick?: () => void;
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

type ButtonProps = ButtonChildrenProps | ButtonInlineProps;

const Button: React.FC<ButtonProps> = (props) => {
  const variantClasses = props.variant === "none" ? "" : `bg-${props.variant}-600 text-white hover:bg-${props.variant}-700 focus-visible:outline-${props.variant}-600`;
  
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
