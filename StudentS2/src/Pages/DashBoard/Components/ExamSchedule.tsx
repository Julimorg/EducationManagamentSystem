import React from 'react'

const exams = [
  { id: 1, exam: 'Midterm — Math', date: 'Apr 25', duration: '60 min' },
  { id: 2, exam: 'Biology Quiz 3', date: 'May 2', duration: '30 min' },
  { id: 3, exam: 'Literature Final', date: 'May 10', duration: '90 min' },
  { id: 4, exam: 'English Speaking Test', date: 'May 15', duration: '20 min' },
]

export function ExamSchedule() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Exam schedule</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[360px]">
          <thead>
            <tr>
              {['Exam', 'Date', 'Duration'].map((h) => (
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
            {exams.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-800">
                  {item.exam}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {item.date}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
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