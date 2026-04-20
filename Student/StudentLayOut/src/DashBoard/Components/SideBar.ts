import React from 'react'
import { XIcon } from 'lucide-react'
type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 h-screen flex flex-col flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">IELTS EduSystem</h1>
            <p className="text-sm text-gray-500 mt-1">Student Portal</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Main
            </h2>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center px-6 py-2.5 bg-orange-50 text-orange-700 relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-3"></span>
                <span className="font-medium">Dashboard</span>
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Assignments</span>
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Exams</span>
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Materials</span>
              </a>
            </nav>
          </div>

          <div>
            <h2 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              My Account
            </h2>
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Profile</span>
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Notifications</span>
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Feedback</span>
              </a>
              <a
                href="#"
                className="flex items-center px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-3"></span>
                <span>Session Transfer</span>
              </a>
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}
