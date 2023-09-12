import { Fragment } from 'react'
import { NavLink } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { BuildingStorefrontIcon, CalendarIcon, ChartPieIcon, ChevronDownIcon, Cog6ToothIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, MagnifyingGlassIcon, Square3Stack3DIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useThemeContext } from '@hooks/themeContext';
import { ClassDictionary, classNames } from '@lib/utils';

const topSidebarNavs = [
  // { name: 'Dashboard', href: '/secure/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/secure/master/products', icon: FolderIcon },
  { name: 'Containers', href: '/secure/master/containers', icon: DocumentDuplicateIcon },
  { name: 'Stores', href: '/secure/master/stores', icon: BuildingStorefrontIcon },
  { name: 'Machines', href: '/secure/master/machines', icon: BuildingStorefrontIcon },
  { name: 'Customers', href: '/secure/master/customers', icon: BuildingStorefrontIcon },
  { name: 'Users', href: '/secure/admin/users', icon: BuildingStorefrontIcon },
  { name: 'Roles', href: '/secure/admin/roles', icon: BuildingStorefrontIcon },

  { name: 'Batch Labels', href: '/secure/warehouse/batchlabels', icon: BuildingStorefrontIcon },
  { name: 'Inventory', href: '/secure/warehouse/inventories', icon: Square3Stack3DIcon },
  // { name: 'Calendar', href: '/secure/calendar', icon: CalendarIcon },
  // { name: 'Reports', href: '/secure/reports', icon: ChartPieIcon },
];

// const bottomSidebarNavs = [
//   { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
// ];

interface SidebarProps {
  sidebarOpen: boolean;
  updateSidebarOpen: (openStatus: boolean) => void
};

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, updateSidebarOpen } ) => {
  const { theme } = useThemeContext();

  const sidebarBackGround: ClassDictionary = {
    "bg-primary-600": theme.hasColorBg,
    'bg-white': !theme.hasColorBg,
  };

  const setSidebarOpen = (openStatus: boolean) => {
    if (updateSidebarOpen) {
      updateSidebarOpen(openStatus)
    }
  }

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col overflow-y-auto">
                  <div className="flex h-16 shrink-0 items-center bg-white">
                    <img className="h-24 w-auto" src="/images/berry-global.png" alt="Berry Global" />
                  </div>
                  <nav className="flex flex-1 flex-col bg-primary-600 pt-5 px-6 pb-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {topSidebarNavs.map((item) => (
                            <li key={item.name}>
                              <NavLink to={item.href} end
                                className={({ isActive }) =>
                                  classNames(
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                    isActive ? "bg-primary-700 text-white" : "text-primary-200 hover:text-white hover:bg-primary-700",
                                  )
                                }>
                                {({ isActive }) => (
                                  <>
                                    <item.icon className={classNames("h-6 w-6 shrink-0", isActive ? "text-white" : "text-primary-200 group-hover:text-white")} aria-hidden="true" />
                                    <span>{item.name}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                      {/* <li className="mt-auto">
                        {bottomSidebarNavs.map((item) => (
                            <li key={item.name}>
                              <NavLink to={item.href} end
                                className={({ isActive }) =>
                                  classNames(
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                    isActive ? "bg-primary-700 text-white" : "text-primary-200 hover:text-white hover:bg-primary-700",
                                  )
                                }>
                                {({ isActive }) => (
                                  <>
                                    <item.icon className={classNames("h-6 w-6 shrink-0", isActive ? "text-white" : "text-primary-200 group-hover:text-white")} aria-hidden="true" />
                                    <span>{item.name}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          ))}
                      </li> */}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="relative hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-52 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className={classNames("flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600", sidebarBackGround)}>
          <div className="flex h-16 shrink-0 items-center bg-white">
            <div className="absolute w-full left-0 top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <img className="h-24 w-auto" src="/images/berry-global.png" alt="Berry Global" />
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7 text-sm">
              <li>
                <ul role="list">
                  {topSidebarNavs.map((item) => (
                    <li key={item.name}>
                      <NavLink to={item.href} end
                        className={({ isActive }) =>
                          classNames(
                            "flex gap-2 px-4 py-3 text-gray-500 group",
                            isActive ? "text-gray-950 bg-primary-100 font-medium hover:text-white hover:bg-primary" : "hover:text-white hover:bg-primary",
                          )
                        }>
                        {({ isActive }) => (
                          <>
                            <item.icon className={classNames("h-6 w-6 shrink-0", isActive ? "text-primary group-hover:text-white" : "")} aria-hidden="true" />
                            <span>{item.name}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              {/* <li className='mt-auto mb-10'>
                <ul role="list">
                  {bottomSidebarNavs.map((item) => (
                    <li key={item.name}>
                      <NavLink to={item.href} end
                        className={({ isActive }) =>
                          classNames(
                            "flex gap-2 px-4 py-3 text-gray-500 group",
                            isActive ? "text-gray-950 bg-primary-100 font-medium hover:text-white hover:bg-primary" : "hover:text-white hover:bg-primary",
                          )
                        }>
                        {({ isActive }) => (
                          <>
                            <item.icon className={classNames("h-6 w-6 shrink-0", isActive ? "text-primary group-hover:text-white" : "")} aria-hidden="true" />
                            <span>{item.name}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar;