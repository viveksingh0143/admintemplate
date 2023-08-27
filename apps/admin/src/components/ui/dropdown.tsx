import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { CommonVariant } from '@ctypes/common';
import { classNames } from '@lib/utils';

type DropdownOptionObject = {
  [key: string]: any; // Allow any string as key, with any type as value
};

type DropdownOption = string | DropdownOptionObject;

interface DropdownProps {
  variant: CommonVariant;
  chevron?: boolean;
  loading?: boolean;
  loadingText?: string;
  options: DropdownOption[];
  labelKey?: string;
  valueKey?: string;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  showSelectedItem?: boolean;
  onChange?: (value: any) => void;
  rootClassName?: string;
  buttonClassName?: string;
  optionsGroupClassName?: string;
  optionClassName?: string;
  value?: DropdownOption | null;
}

const Dropdown: React.FC<DropdownProps> = ({
  variant,
  chevron = true,
  loading = false,
  loadingText,
  options,
  labelKey = 'label',
  valueKey = 'value',
  buttonLabel,
  buttonIcon,
  showSelectedItem = false,
  onChange,
  rootClassName,
  buttonClassName,
  optionsGroupClassName,
  optionClassName,
  value = null,
}) => {
  const [selectedItem, setSelectedItem] = useState<DropdownOption | null>(value);
  const variantClasses = {
    primary: "rounded-lg shadow-sm ring-1 ring-inset bg-primary-600 text-white hover:bg-primary-700 ring-primary-800 focus-visible:outline-primary-600",
    secondary: "rounded-lg shadow-sm ring-1 ring-inset bg-secondary-600 text-white hover:bg-secondary-700 ring-secondary-800 focus-visible:outline-secondary-600",
    success: "rounded-lg shadow-sm ring-1 ring-inset bg-success-600 text-white hover:bg-success-700 ring-success-800 focus-visible:outline-success-600",
    warning: "rounded-lg shadow-sm ring-1 ring-inset bg-warning-600 text-white hover:bg-warning-700 ring-warning-800 focus-visible:outline-warning-600",
    info: "rounded-lg shadow-sm ring-1 ring-inset bg-info-600 text-white hover:bg-info-700 ring-info-800 focus-visible:outline-info-600",
    danger: "rounded-lg shadow-sm ring-1 ring-inset bg-danger-600 text-white hover:bg-danger-700 ring-danger-800 focus-visible:outline-danger-600",
    none: "",
  }[variant];
  
  const handleClick = (option: DropdownOption) => {
    setSelectedItem(option);
    if (typeof option === 'string') {
      onChange?.(option);
    } else if (option.onClick !== undefined) {
      option.onClick();
    } else {
      onChange?.(valueKey ? option[valueKey] : option);
    }
  };

  const renderButtonLabel = () => {
    if (showSelectedItem && selectedItem) {
      return typeof selectedItem === 'string' ? selectedItem : selectedItem[labelKey];
    } else {
      return (
        <>
          {buttonIcon && buttonIcon}
          {buttonLabel && buttonLabel}
        </>
      )
    }
  }
  
  const renderButtonContent = () => {
    return (
      <div className="flex flex-row flex-1">
        <div className="flex flex-row flex-1">
          { renderButtonLabel() }
        </div>
        { chevron && (
          <div className="flex-none ml-1">
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Menu as="div" className={classNames('relative inline-block text-left', rootClassName)}>
      <div>
        <Menu.Button className={classNames('px-4 py-2 text-sm font-medium leading-6 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', variantClasses, buttonClassName)}>
          {loading ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2 inline-block" />
              {loadingText}
            </>
          ) : renderButtonContent()}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={classNames('absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none', optionsGroupClassName)}>
          {loading ? (
            <div>{ loadingText ? loadingText : "Loading..." }</div>
          ) : (
            options.map((option, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div
                    onClick={() => handleClick(option)}
                    className={classNames(active ? 'bg-primary-100 text-white-900' : 'text-gray-700', 'block px-4 py-2 text-sm', optionClassName)}
                  >
                    {typeof option === 'string' ? option : option[labelKey]}
                  </div>
                )}
              </Menu.Item>
            ))
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
