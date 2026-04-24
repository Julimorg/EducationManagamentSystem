import React from 'react'
export function Notifications() {
  const notifications = [
    {
      id: 1,
      text: 'New assignment posted — Math',
      time: '2h ago',
      unread: true,
    },
    {
      id: 2,
      text: 'Deadline in 24h: Essay on Photosynthesis',
      time: '5h ago',
      unread: true,
    },
    {
      id: 3,
      text: 'Grade published: Biology Quiz 2',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 4,
      text: 'Session transfer approved',
      time: '2 days ago',
      unread: false,
    },
  ]
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-900">Notifications</h3>
        <button className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors">
          Mark all read
        </button>
      </div>

      <div className="p-2 flex-1 overflow-y-auto">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="mt-1.5 mr-4 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${item.unread ? 'bg-blue-500' : 'bg-gray-300'}`}
              ></div>
            </div>
            <div>
              <p
                className={`text-sm ${item.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
              >
                {item.text}
              </p>
              <p className="text-xs text-gray-400 mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
