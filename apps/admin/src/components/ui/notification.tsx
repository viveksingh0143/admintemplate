import { CommonVariant } from '@ctypes/common';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, FireIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { classNames } from '@lib/utils';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

type NotificationProps = {
  message?: string | null;
  type?: CommonVariant;
  icon?: React.ReactNode;
  fixed?: boolean;
  className?: string;
  onClose?: () => void;
};

export type NotificationHandles = {
  closeNotification: () => void;
  showNotification: (msg: string, variant: CommonVariant) => void;
};

export const Notification = forwardRef<NotificationHandles, NotificationProps>(({ className, message, type = "success", icon, fixed = true, onClose }, ref) => {
  const [msg, setMsg] = useState(message);
  const [variant, setVariant] = useState(type);
  const [show, setShow] = useState(false);

  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    info: "bg-info",
    danger: "bg-danger",
    none: "",
  }[variant];

  let defaultIcon: React.ReactNode = {
    primary: null,
    secondary: null,
    success: <CheckCircleIcon className="pl-2 text-white h-5" />,
    warning: <ExclamationCircleIcon className="pl-2 text-white h-5" />,
    info: <InformationCircleIcon className="pl-2 text-white h-5" />,
    danger: <FireIcon className="pl-2 text-white h-5" />,
    none: null,
  }[variant];

  const onCloseHandler = () => {
    if (onClose) {
      onClose();
    }
    setShow(false);
  }

  useImperativeHandle(ref, () => ({
    showNotification: (msg: string, variant: CommonVariant) => {
      setShow(true);
      setMsg(msg);
      setVariant(variant);
    },
    closeNotification: () => {
      onCloseHandler();
    },
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseHandler();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [onClose, msg, variant, icon]);

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={classNames(`text-xs text-white rounded shadow-lg z-1000`, fixed ? "fixed top-0 right-0 m-6" : "my-1", variantClasses, className)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {icon ? icon : defaultIcon}
            <span className="py-3 ml-2">{msg}</span>
          </div>
          <button onClick={onCloseHandler} className="text-white ml-2">
            <XCircleIcon className="px-3 text-white h-5 ml-2" />
          </button>
        </div>
      </div>
    </Transition>
  );
});
