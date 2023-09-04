import { useState } from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from './sidebar';
import Topbar from './topbar';

const PrimeLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} updateSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-52 h-full bg-neutral-200">
        <Topbar updateSidebarOpen={setSidebarOpen} />
        <main className='pb-4'>
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default PrimeLayout;