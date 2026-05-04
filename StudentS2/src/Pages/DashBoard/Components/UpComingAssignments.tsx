import React from 'react'

const deadlines = [
  {
    id: 1,
    assignment: 'Essay on Photosynthesis',
    subject: 'Biology',
    date: 'Apr 19, 23:59',
    status: '24h left',
    statusClass: 'bg-red-50 text-red-600',
  },
  {
    id: 2,
    assignment: 'Math Problem Set 3',
    subject: 'Math',
    date: 'Apr 20, 23:59',
    status: 'Pending',
    statusClass: 'bg-orange-50 text-orange-600',
  },
  {
    id: 3,
    assignment: 'Literature Review',
    subject: 'English',
    date: 'Apr 22, 23:59',
    status: 'Not started',
    statusClass: 'bg-gray-100 text-gray-600',
  },
]

export function UpcomingAssignments() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          Upcoming assignments
        </h3>
        <a
          href="#"
          className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          View all
        </a>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[480px]">
          <thead>
            <tr>
              {['Assignment', 'Subject', 'Due Date', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deadlines.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-800">
                  {item.assignment}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {item.subject}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {item.date}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.statusClass}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}