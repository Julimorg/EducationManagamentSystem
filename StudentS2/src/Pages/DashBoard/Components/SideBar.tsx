import React from 'react'
import { X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const mainLinks = [
  { label: 'Dashboard',        to: '/dashboard' },
  { label: 'Assignments',      to: '/assignments' },
  { label: 'Exams',            to: '/exams' },
  { label: 'Materials',        to: '/materials' },
]

const accountLinks = [
  { label: 'Profile',          to: '/profile' },
  { label: 'Notifications',    to: '/notifications' },
  { label: 'Feedback',         to: '/feedback' },
  { label: 'Session Transfer', to: '/session-transfer' },
]

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

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-56 bg-white border-r border-gray-200 h-full flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-gray-900 leading-tight">
              IELTS EduSystem
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Student Portal</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-5">
          <NavGroup label="Main"       links={mainLinks}   onClose={onClose} />
          <NavGroup label="My Account" links={accountLinks} onClose={onClose} />
        </nav>
      </aside>
    </>
  )
}

/* ─── NavGroup ─── */
function NavGroup({
  label,
  links,
  onClose,
}: {
  label: string
  links: { label: string; to: string }[]
  onClose: () => void
}) {
  return (
    <div>
      <p className="px-5 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-5 py-2 text-sm transition-colors relative
             ${isActive
               ? 'bg-orange-50 text-orange-700 font-medium'
               : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
             }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 rounded-r-full" />
              )}
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
              {link.label}
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}