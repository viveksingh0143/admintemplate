import { CommonVariant } from '@ctypes/common';
import { classNames } from '@lib/utils';
import React from 'react';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  variant?: CommonVariant;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ label, icon, variant = "primary", className }) => {
  const variantClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    info: "bg-info text-white",
    danger: "bg-danger text-white",
    none: "bg-gray text-gray-700",
  }[variant];

  return (
    <div className={classNames("inline-flex items-center px-3 py-1 rounded-full", variantClasses, className)}>
      {icon && <span className="mr-2">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export default Chip;