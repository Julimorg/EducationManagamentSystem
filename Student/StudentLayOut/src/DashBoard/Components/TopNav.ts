import React from 'react'
import { MenuIcon } from 'lucide-react'
type TopNavProps = {
  onToggleSidebar: () => void
}
export function TopNav({ onToggleSidebar }: TopNavProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        <span className="text-sm text-gray-400 hidden sm:inline">
          Sat, Apr 18 2026
        </span>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
            AN
          </div>
          <span className="text-sm font-medium text-gray-600 hidden sm:inline">
            Alice Nguyen
          </span>
          <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
            Active
          </span>
        </div>
      </div>
    </header>
  )
}
