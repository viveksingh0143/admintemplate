import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from '@lib/utils';

export interface TabType {
  name: string;
  href?: string;
  icon?: ReactNode;
  data?: any | null | undefined;
}

interface TabGroupProps {
  tabs: TabType[];
  currentTab?: TabType;
  onTabClick?: (tab: TabType) => void;
  label?: string;
}

const TabGroup: React.FC<TabGroupProps> = ({ tabs, currentTab, onTabClick, label }) => {

  const onTabClickHandler = (tabName: string) => {
    if (onTabClick) {
      const selectedTab = tabs.find(t => t.name === tabName);
      if (selectedTab) {
        onTabClick(selectedTab);
      }
    }
  };

  return (
    <div>
      <div className="sm:hidden">
        {label && (
          <label htmlFor="tabs" className="sr-only">
            {label}
          </label>
        )}
        {currentTab && onTabClick && (
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-primary-300 focus:border-primary-500 focus:ring-primary-500"
            value={currentTab.name}
            onChange={(e) => onTabClickHandler(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-primary-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.href || ''}
                className={classNames(
                  tab.name === currentTab?.name
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-primary-300 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                )}
                onClick={() => {
                  if (!tab.href && onTabClick) {
                    onTabClickHandler(tab.name);
                  }
                }}
                aria-current={tab.name === currentTab?.name ? 'page' : undefined}
              >
                {tab.icon && (
                  <span
                    className={classNames(
                      tab.name === currentTab?.name
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      '-ml-0.5 mr-2 h-5 w-5'
                    )}
                    aria-hidden="true"
                  >
                    {tab.icon}
                  </span>
                )}
                <span>{tab.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabGroup;
