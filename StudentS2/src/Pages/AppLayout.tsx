import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './DashBoard/Components/SideBar'
import { TopNav } from './DashBoard/Components/TopNav'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] overflow-hidden">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">

        <TopNav
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}