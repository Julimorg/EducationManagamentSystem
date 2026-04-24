import React from 'react'
export function UpcomingDeadlines() {
  const deadlines = [
    {
      id: 1,
      assignment: 'Essay on Photosynthesis',
      subject: 'Biology',
      date: 'Apr 19, 23:59',
      status: '24h left',
      statusColor: 'bg-red-50 text-red-600',
    },
    {
      id: 2,
      assignment: 'Math Problem Set 3',
      subject: 'Math',
      date: 'Apr 20, 23:59',
      status: 'Pending',
      statusColor: 'bg-orange-50 text-orange-600',
    },
    {
      id: 3,
      assignment: 'Literature Review',
      subject: 'English',
      date: 'Apr 22, 23:59',
      status: 'Not started',
      statusColor: 'bg-gray-100 text-gray-600',
    },
  ]
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-900">
          Upcoming deadlines
        </h3>
        <a
          href="#"
          className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          View all
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Assignment
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Subject
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Due Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deadlines.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {item.assignment}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.subject}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}
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
