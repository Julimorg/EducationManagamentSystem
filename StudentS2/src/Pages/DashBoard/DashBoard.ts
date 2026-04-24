import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import { StatCards } from '../components/StatCards'
import { UpcomingDeadlines } from '../components/UpcomingDeadlines'
import { Notifications } from '../components/Notifications'
import { ExamSchedule } from '../components/ExamSchedule'
import { RecentGrades } from '../components/RecentGrades'
export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <StatCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <UpcomingDeadlines />
              </div>
              <div className="lg:col-span-1">
                <Notifications />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ExamSchedule />
              </div>
              <div>
                <RecentGrades />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
