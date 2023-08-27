import { CommonVariant } from '@ctypes/common';
import { classNames } from '@lib/utils';
import React from 'react';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  variant?: CommonVariant;
}

const Chip: React.FC<ChipProps> = ({ label, icon, variant = "primary" }) => {
  const variantClasses = {
    primary: "bg-primary-200 text-white",
    secondary: "bg-secondary-200 text-white",
    success: "bg-success-200 text-white",
    warning: "bg-warning-200 text-white",
    info: "bg-info-200 text-white",
    danger: "bg-danger-200 text-white",
    none: "bg-gray-200 text-gray-700",
  }[variant];

  return (
    <div className={classNames("inline-flex items-center px-3 py-1 rounded-full", variantClasses)}>
      {icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export default Chip;