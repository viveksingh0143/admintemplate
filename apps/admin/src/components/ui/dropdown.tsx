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
}) => {
  const [selectedItem, setSelectedItem] = useState<DropdownOption | null>(null);

  const variantClasses = variant === "none" ? "" : `rounded-lg shadow-sm ring-1 ring-inset bg-${variant}-600 text-white hover:bg-${variant}-700 ring-${variant}-800 focus-visible:outline-${variant}-600`;
  
  const handleClick = (option: DropdownOption) => {
    setSelectedItem(option);
    if (typeof option === 'string') {
      onChange?.(option);
    } else {
      onChange?.(valueKey ? option[valueKey] : option);
    }
  };

  const renderButtonContent = () => {
    if (showSelectedItem && selectedItem) {
      return typeof selectedItem === 'string' ? selectedItem : selectedItem[labelKey];
    }
    return (
      <div className="flex flex-row flex-1">
        <div className="flex flex-row flex-1">
          {buttonIcon && buttonIcon}
          {buttonLabel && buttonLabel}
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
