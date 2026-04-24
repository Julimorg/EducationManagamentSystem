import React from 'react'
export function ExamSchedule() {
  const exams = [
    {
      id: 1,
      exam: 'Midterm — Math',
      date: 'Apr 25',
      duration: '60 min',
    },
    {
      id: 2,
      exam: 'Biology Quiz 3',
      date: 'May 2',
      duration: '30 min',
    },
  ]
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Exam schedule</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Exam
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exams.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{item.exam}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
