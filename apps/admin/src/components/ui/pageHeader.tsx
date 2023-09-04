import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { classNames } from '@lib/utils';
import React from 'react';
import Dropdown from './dropdown';
import Button, { ButtonProps } from './button';
import { useThemeContext } from '@hooks/themeContext';

interface BreadcrumbLink {
  label: string;
  action?: string;
  onClick?: any;
}

interface BreadcrumbLink {
  label: string;
  action?: string;
  onClick?: any;
}

type PageHeaderProps = {
  label?: string;
  breadcrumbs?: BreadcrumbLink[] | null;
  actions?: ButtonProps[] | null;
  children?: any | null;
  showBreadCrumb?: boolean;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ showBreadCrumb = false, children, label, breadcrumbs, actions, className }) => {
  const { theme } = useThemeContext();

  const renderBreadCrumbs = () => {
    if (breadcrumbs) {
      return (
        <div>
          <nav className="sm:hidden" aria-label="Back">
            <a href="#" className="flex items-center text-sm font-medium text-white-400 hover:text-white-200">
              <ChevronLeftIcon className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-white-500" aria-hidden="true" /> Back
            </a>
          </nav>
          <nav className="hidden sm:flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.label}>
                  <div className="flex">
                    {index > 0 && <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-white-500" aria-hidden="true" />}
                    <a href="#" className="text-sm font-medium text-white-400 hover:text-white-200">
                      {breadcrumb.label}
                    </a>
                  </div>
                </li>
              ))}
            </ol>you
          </nav>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderActionButtons = () => {
    if (actions) {
      return (
        <>
          <div className="hidden sm:flex gap-3">
            {actions.map((action, index) => (
              <Button key={index} {...action} />
            ))}
          </div>
          <Dropdown rootClassName='flex sm:hidden' optionsGroupClassName="top-7 w-72" optionClassName="py-4 px-4"
            options={actions} variant="none" buttonClassName="text-primary pr-0" chevron={false} buttonIcon={<EllipsisVerticalIcon className="h-6 w-6" />} />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classNames("px-2 pt-4 sm:px-6", theme.hasColorBg ? "bg-primary-500 text-white" : "text-gray-600", className)}>
      {showBreadCrumb && renderBreadCrumbs()}
      <div className={classNames("flex items-center justify-between", { "mt-6": showBreadCrumb })}>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-xl sm:tracking-tight">
            {label}
          </h2>
        </div>
        {renderActionButtons()}
      </div>
      { children }
    </div>
  );
};

export default PageHeader;
