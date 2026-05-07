import React, { useState, useRef, useEffect } from 'react'
import { Menu, Bell } from 'lucide-react'

type TopNavProps = {
  onToggleSidebar: () => void
}

type Notification = {
  id: number
  text: string
  time: string
  unread: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'New assignment posted — Math',           time: '2h ago',    unread: true  },
  { id: 2, text: 'Deadline in 24h: Essay on Photosynthesis', time: '5h ago', unread: true  },
  { id: 3, text: 'Grade published: Biology Quiz 2',         time: 'Yesterday', unread: false },
  { id: 4, text: 'Session transfer approved',               time: '2 days ago', unread: false },
]

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const [open, setOpen]   = useState(false)
  const [items, setItems] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const ref               = useRef<HTMLDivElement>(null)

  const unreadCount = items.filter((n) => n.unread).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-semibold text-gray-900 leading-tight">
            Dashboard
          </h2>
          <p className="hidden sm:block text-[11px] text-gray-400 mt-0.5">
            Class 12B &nbsp;·&nbsp; Session 2-4-6 &nbsp;(5h – 7h)
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* <span className="hidden md:inline text-xs text-gray-400">
          Sat, Apr 18 2026
        </span> */}

        {/* Bell */}
        {/* <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div
                      className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        item.unread ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                    <div>
                      <p className={`text-sm leading-snug ${
                        item.unread ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {item.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
            AN
          </div>
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            Alice Nguyen
          </span>
          <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-semibold">
            Active
          </span>
        </div>
      </div>
    </header>
  )
}